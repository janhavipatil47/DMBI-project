from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Load datasets
try:
    matches_df = pd.read_csv('matches.csv')
    deliveries_df = pd.read_csv('deliveries.csv')
    print("✅ Data loaded successfully!")
except Exception as e:
    print(f"⚠️ Error loading data: {e}")
    print("⚠️ Using dummy data")
    matches_df = pd.DataFrame({
        'id': range(1, 101),
        'season': [2020, 2021] * 50,
        'city': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'] * 25,
        'team1': ['MI', 'CSK', 'RCB', 'KKR'] * 25,
        'team2': ['DC', 'RR', 'SRH', 'PBKS'] * 25,
        'winner': ['MI', 'CSK', 'RCB', 'KKR'] * 25,
        'venue': ['Wankhede', 'Chepauk', 'Chinnaswamy', 'Eden'] * 25
    })
    deliveries_df = pd.DataFrame({
        'match_id': [1] * 100,
        'batter': ['Player' + str(i) for i in range(1, 11)] * 10,
        'bowler': ['Bowler' + str(i) for i in range(1, 11)] * 10,
        'batsman_runs': np.random.randint(0, 7, 100),
        'total_runs': np.random.randint(0, 7, 100)
    })

print("🚀 IPL Analytics Server Starting...")
print("📊 Dashboard: Open dashboard.html in your browser")
print("🔗 API: http://localhost:5000/api")

@app.route('/api/data/overview')
def overview():
    return jsonify({
        'total_matches': int(len(matches_df)),
        'total_seasons': int(matches_df['season'].nunique()),
        'total_teams': int(pd.concat([matches_df['team1'], matches_df['team2']]).nunique()),
        'total_deliveries': int(len(deliveries_df))
    })

@app.route('/api/data/team-performance')
def team_performance():
    teams = pd.concat([matches_df['team1'], matches_df['team2']]).unique()
    stats = []
    for team in teams:
        matches = matches_df[(matches_df['team1'] == team) | (matches_df['team2'] == team)]
        wins = len(matches_df[matches_df['winner'] == team])
        stats.append({
            'team': team,
            'matches': int(len(matches)),
            'wins': wins,
            'win_percentage': round((wins / len(matches) * 100) if len(matches) > 0 else 0, 2)
        })
    return jsonify({'team_stats': sorted(stats, key=lambda x: x['win_percentage'], reverse=True)})

def parse_season(season_str):
    """Convert season strings like '2007/08' to integer 2007"""
    if isinstance(season_str, str) and '/' in season_str:
        return int(season_str.split('/')[0])
    try:
        return int(season_str)
    except:
        return 0

@app.route('/api/data/team-details/<team_name>')
def team_details(team_name):
    team_matches = matches_df[(matches_df['team1'] == team_name) | (matches_df['team2'] == team_name)]
    
    # Parse seasons properly
    team_matches = team_matches.copy()
    team_matches['season_int'] = team_matches['season'].apply(parse_season)
    
    performance = []
    for season in sorted(team_matches['season_int'].unique()):
        season_matches = team_matches[team_matches['season_int'] == season]
        wins = len(season_matches[season_matches['winner'] == team_name])
        total = len(season_matches)
        performance.append({
            'season': season,
            'matches': int(total),
            'wins': wins,
            'win_percentage': round((wins / total * 100) if total > 0 else 0, 2)
        })
    return jsonify({'performance_by_season': performance})

@app.route('/api/data/venue-analysis')
def venue_analysis():
    city_matches = matches_df.groupby('city').size().reset_index(name='match_count')
    return jsonify({
        'city_matches': city_matches.sort_values('match_count', ascending=False).head(15).to_dict('records')
    })

@app.route('/api/data/player-stats')
def player_stats():
    # Use 'batter' instead of 'batsman'
    batsmen = deliveries_df.groupby('batter')['batsman_runs'].sum().reset_index()
    batsmen.columns = ['player', 'total_runs']
    
    # Calculate wickets for bowlers
    bowlers = deliveries_df[deliveries_df['is_wicket'] == 1].groupby('bowler').size().reset_index(name='wickets') if 'is_wicket' in deliveries_df.columns else deliveries_df.groupby('bowler').size().reset_index(name='wickets')
    bowlers.columns = ['player', 'wickets']
    
    return jsonify({
        'top_batsmen': batsmen.sort_values('total_runs', ascending=False).head(20).to_dict('records'),
        'top_bowlers': bowlers.sort_values('wickets', ascending=False).head(20).to_dict('records')
    })

@app.route('/api/data/season-trends')
def season_trends():
    # Parse seasons properly
    deliveries_with_match = deliveries_df.merge(matches_df[['id', 'season']], left_on='match_id', right_on='id')
    deliveries_with_match['season_int'] = deliveries_with_match['season'].apply(parse_season)
    
    trends = deliveries_with_match.groupby('season_int').agg({
        'batsman_runs': lambda x: (x == 6).sum(),  # sixes
        'total_runs': lambda x: (x == 4).sum()  # fours (approximation)
    }).reset_index()
    
    trends.columns = ['season', 'sixes', 'fours']
    return jsonify({
        'boundaries_trend': trends.sort_values('season').to_dict('records')
    })

@app.route('/api/data/match-details')
def match_details():
    if 'over' in deliveries_df.columns:
        runs_by_over = deliveries_df.groupby('over')['total_runs'].sum().reset_index()
    else:
        runs_by_over = pd.DataFrame({'over': range(1, 21), 'total_runs': np.random.randint(30, 80, 20)})
    
    return jsonify({
        'runs_by_over': runs_by_over.to_dict('records')
    })

@app.route('/api/clustering/batsman-clusters')
def batsman_clusters():
    # Use 'batter' instead of 'batsman'
    stats = deliveries_df.groupby('batter').agg({
        'batsman_runs': ['sum', 'count'],
        'match_id': 'nunique'
    }).reset_index()
    
    stats.columns = ['player', 'runs', 'balls', 'matches']
    stats = stats[stats['balls'] >= 100]  # Minimum qualification
    stats['strike_rate'] = (stats['runs'] / stats['balls'] * 100)
    stats['average'] = stats['runs'] / stats['matches']
    
    # Prepare features for clustering
    X = stats[['strike_rate', 'average']].fillna(0)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # K-Means clustering
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    stats['cluster'] = kmeans.fit_predict(X_scaled)
    
    # Label clusters
    cluster_labels = {0: 'Aggressive', 1: 'Consistent', 2: 'Balanced'}
    stats['cluster_name'] = stats['cluster'].map(cluster_labels)
    
    return jsonify({
        'clusters': stats.head(50).to_dict('records')
    })

@app.route('/api/clustering/team-clusters')
def team_clusters():
    teams = pd.concat([matches_df['team1'], matches_df['team2']]).unique()
    team_stats = []
    
    for team in teams:
        matches = matches_df[(matches_df['team1'] == team) | (matches_df['team2'] == team)]
        wins = len(matches_df[matches_df['winner'] == team])
        win_pct = (wins / len(matches) * 100) if len(matches) > 0 else 0
        team_stats.append({
            'team': team,
            'matches': len(matches),
            'wins': wins,
            'win_percentage': win_pct
        })
    
    df = pd.DataFrame(team_stats)
    X = df[['win_percentage']].values
    
    # Hierarchical clustering
    clustering = AgglomerativeClustering(n_clusters=3)
    df['cluster'] = clustering.fit_predict(X)
    
    cluster_labels = {0: 'Aggressive', 1: 'Consistent', 2: 'Balanced'}
    df['cluster_name'] = df['cluster'].map(cluster_labels)
    
    return jsonify({
        'clusters': df.to_dict('records')
    })

@app.route('/api/rules')
def association_rules_endpoint():
    min_conf = float(request.args.get('min_conf', 0.6))
    min_sup = float(request.args.get('min_sup', 0.05))
    
    try:
        # Create transactions from match data
        transactions = []
        for _, match in matches_df.iterrows():
            transaction = [match['team1'], match['team2'], match['city'], match.get('toss_winner', 'Unknown')]
            transactions.append([str(x) for x in transaction if pd.notna(x)])
        
        te = TransactionEncoder()
        te_ary = te.fit(transactions).transform(transactions)
        df = pd.DataFrame(te_ary, columns=te.columns_)
        
        # Apply Apriori
        frequent_itemsets = apriori(df, min_support=min_sup, use_colnames=True)
        
        if len(frequent_itemsets) == 0:
            return jsonify([])
        
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_conf)
        
        result = []
        for _, rule in rules.iterrows():
            result.append({
                'antecedent': list(rule['antecedents']),
                'consequent': list(rule['consequents']),
                'confidence': float(rule['confidence']),
                'support': float(rule['support']),
                'lift': float(rule['lift'])
            })
        
        return jsonify(result[:20])
    except Exception as e:
        print(f"Error in association rules: {e}")
        return jsonify([])

@app.route('/api/players/suggest')
def suggest_players():
    query = request.args.get('q', '').lower()
    # Use 'batter' column
    players = deliveries_df['batter'].unique()
    filtered = [p for p in players if query in str(p).lower()]
    return jsonify(filtered[:10])

@app.route('/api/players/stats')
def player_stats_detail():
    name = request.args.get('name')
    # Use 'batter' column
    player_data = deliveries_df[deliveries_df['batter'] == name]
    
    total_runs = int(player_data['batsman_runs'].sum())
    total_balls = len(player_data)
    strike_rate = (total_runs / total_balls * 100) if total_balls > 0 else 0
    
    matches = player_data['match_id'].nunique()
    average = total_runs / matches if matches > 0 else 0
    
    return jsonify({
        'name': name,
        'total_runs': total_runs,
        'strike_rate': strike_rate,
        'average': average,
        'role': 'Batsman',
        'recent_matches': []
    })

@app.route('/api/players/team-stats')
def team_stats():
    team = request.args.get('team')
    team_matches = matches_df[(matches_df['team1'] == team) | (matches_df['team2'] == team)]
    wins = len(matches_df[matches_df['winner'] == team])
    
    # Parse seasons properly
    team_matches = team_matches.copy()
    team_matches['season_int'] = team_matches['season'].apply(parse_season)
    
    seasons = []
    for season in sorted(team_matches['season_int'].unique()):
        season_data = team_matches[team_matches['season_int'] == season]
        match_ids = season_data['id'].values
        season_deliveries = deliveries_df[deliveries_df['match_id'].isin(match_ids)]
        avg_runs = season_deliveries['total_runs'].mean() if len(season_deliveries) > 0 else 0
        
        seasons.append({
            'season': int(season),
            'avg_runs': round(float(avg_runs), 2)
        })
    
    return jsonify({
        'matches': int(len(team_matches)),
        'wins': int(wins),
        'win_pct': round((wins / len(team_matches) * 100) if len(team_matches) > 0 else 0, 2),
        'seasons': seasons
    })

@app.route('/api/win-probability', methods=['POST'])
def win_probability():
    data = request.json
    
    batting_team = data.get('batting_team')
    bowling_team = data.get('bowling_team')
    city = data.get('city')
    target = data.get('target', 180)
    score = data.get('score', 100)
    wickets = data.get('wickets', 3)
    overs = data.get('overs', 15)
    runs_last_5 = data.get('runs_last_5', 45)
    
    # Calculate features
    runs_left = target - score
    balls_left = (20 - overs) * 6
    wickets_left = 10 - wickets
    crr = (score / overs) if overs > 0 else 0
    rrr = (runs_left / (balls_left / 6)) if balls_left > 0 else 0
    
    # Simple probability calculation
    prob = 0.5  # Base probability
    
    # Adjust based on wickets
    prob += (wickets_left - 5) * 0.05
    
    # Adjust based on required run rate vs current run rate
    if rrr > 0:
        rate_diff = crr - rrr
        prob += rate_diff * 0.05
    
    # Adjust based on balls remaining
    prob += (balls_left - 60) * 0.002
    
    # Clamp between 0.05 and 0.95
    prob = max(0.05, min(0.95, prob))
    
    return jsonify({
        'probability': prob,
        'batting_team': batting_team,
        'bowling_team': bowling_team,
        'required_run_rate': rrr,
        'current_run_rate': crr,
        'runs_left': runs_left,
        'balls_left': int(balls_left),
        'wickets_left': wickets_left
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)