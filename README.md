# IPL Analytics Dashboard 🏏

A comprehensive cricket analytics dashboard powered by machine learning clustering algorithms, built with React and Flask.

## 🌟 Features

### 📊 Data Visualizations
- **Bar Charts**: Team performance, player statistics, venue analysis
- **Pie Charts**: City-wise match distribution, toss decisions, result types
- **Line Charts**: Season trends, run rate evolution, boundary trends
- **Scatter Plots**: Player performance correlation, venue characteristics
- **Box Plots**: Over-wise runs distribution (simulated)

### 🤖 Machine Learning Clustering
- **K-means Clustering**: Batsman performance analysis
  - Power Hitters: High strike rate and boundary rate
  - Consistent Players: Balanced performance
  - Aggressive Batsmen: High risk-reward ratio
  - Anchor Players: Stability-focused approach

- **Agglomerative Clustering**: Team performance analysis
  - Balanced Teams: All-round performance
  - Batting Heavy: Offensive strength
  - Bowling Heavy: Defensive focus

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Beautiful gradient backgrounds
- Interactive charts with Recharts
- Dark/light theme support

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Start the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup
1. Install Node.js dependencies:
```bash
npm install
```

2. Start the React development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
ipl-dashboard/
├── app.py                 # Flask backend with clustering algorithms
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── tailwind.config.js    # Tailwind CSS configuration
├── src/
│   ├── App.js            # Main React component
│   ├── index.js          # React entry point
│   ├── index.css         # Global styles
│   └── components/       # React components
│       ├── Header.js
│       ├── StatsOverview.js
│       ├── TeamPerformance.js
│       ├── VenueAnalysis.js
│       ├── PlayerStats.js
│       ├── SeasonTrends.js
│       ├── ClusteringAnalysis.js
│       ├── MatchDetails.js
│       └── LoadingSpinner.js
├── public/
│   └── index.html        # HTML template
├── matches.csv           # IPL matches data
└── deliveries.csv        # Ball-by-ball data
```

## 🔧 API Endpoints

### Data Endpoints
- `GET /api/data/overview` - Dashboard overview statistics
- `GET /api/data/team-performance` - Team performance metrics
- `GET /api/data/venue-analysis` - Venue and city analysis
- `GET /api/data/player-stats` - Top batsmen and bowlers
- `GET /api/data/season-trends` - Season-wise trends
- `GET /api/data/match-details` - Detailed match data

### Clustering Endpoints
- `GET /api/clustering/batsman-clusters` - K-means batsman clustering
- `GET /api/clustering/team-clusters` - Agglomerative team clustering

## 📊 Data Sources

The dashboard uses IPL data from:
- **matches.csv**: Match information, teams, venues, results
- **deliveries.csv**: Ball-by-ball delivery data

### Data Processing
- SQLite database for efficient data storage
- Data cleaning and preprocessing
- Feature engineering for clustering algorithms
- PCA for dimensionality reduction

## 🎨 Design Features

### Color Scheme
- Primary: Blue gradient (#3B82F6 to #2563EB)
- Cricket theme: Yellow/Orange accents
- Modern: Slate grays and whites

### Components
- Glass morphism effects
- Smooth hover animations
- Responsive grid layouts
- Interactive chart tooltips
- Loading states with spinners

### Typography
- Inter font family
- Gradient text effects
- Responsive text sizing

## 🔬 Machine Learning Details

### K-means Clustering (Batsmen)
- **Features**: Strike Rate, Boundary Rate, Average, Total Runs
- **Clusters**: 4 distinct playing styles
- **Preprocessing**: StandardScaler normalization
- **Visualization**: PCA reduction to 2D

### Agglomerative Clustering (Teams)
- **Features**: Win Percentage, Runs per Match, Six Rate, Wicket Rate
- **Clusters**: 3 team categories
- **Linkage**: Ward method
- **Distance**: Euclidean

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Performance Optimizations

- Lazy loading of components
- Efficient data processing
- Optimized chart rendering
- Minimal bundle size
- Fast API responses

## 🛠️ Technologies Used

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React Icons

### Backend
- Flask
- SQLite
- scikit-learn
- pandas
- numpy

### Development
- Create React App
- PostCSS
- Autoprefixer

## 📈 Future Enhancements

- Real-time data updates
- Advanced clustering algorithms
- Player comparison tools
- Match prediction models
- Export functionality
- Dark mode toggle

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- IPL data sources
- Recharts for beautiful visualizations
- Tailwind CSS for modern styling
- scikit-learn for machine learning algorithms

---

**Built with ❤️ for cricket analytics enthusiasts**
