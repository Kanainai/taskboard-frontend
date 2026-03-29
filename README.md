# Task Manager Frontend

A modern, responsive task management dashboard built with React, Vite, and Tailwind CSS. Inspired by Linear/Jira design principles.

## Tech Stack

- React 18
- Vite 8
- Tailwind CSS v4
- React Router DOM
- Axios
- date-fns

## Features

- Kanban-style board with three columns (Pending, In Progress, Done)
- Create new tasks with title, due date, and priority
- Advance task status with one click
- Delete completed tasks
- Filter tasks by priority
- Daily task reports with statistics
- Overdue task tracking
- Clean, minimal UI inspired by Linear

## Local Setup

### Prerequisites

- Node.js (LTS version)
- npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd task-manager-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```env
VITE_API_URL=http://localhost:8000/api
```

5. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── api/
│   └── tasks.js          # API client and endpoints
├── components/
│   ├── Sidebar.jsx       # Navigation sidebar
│   ├── TaskCard.jsx      # Individual task card
│   ├── Column.jsx        # Kanban column
│   └── CreateTaskModal.jsx # Task creation modal
├── pages/
│   ├── Board.jsx         # Main kanban board
│   └── Report.jsx        # Daily reports and overdue tasks
├── App.jsx               # Main app with routing
├── main.jsx              # Entry point
└── index.css             # Global styles with Tailwind
```

## Design System

### Colors

- Background: `#ffffff`
- Sidebar: `#f7f7f5`
- Priority indicators:
  - High: Red (`#ef4444`)
  - Medium: Yellow (`#eab308`)
  - Low: Green (`#22c55e`)

### Typography

- Font: Inter (Google Fonts)
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `VITE_API_URL`: Your production API URL
4. Deploy

The `vercel.json` configuration handles client-side routing.

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: `http://localhost:8000/api`)

## Features in Detail

### Kanban Board

- Three columns: Pending, In Progress, Done
- Tasks sorted by priority (high → medium → low), then by due date
- Click arrow icon to advance task status
- Click trash icon to delete completed tasks
- Filter by priority using dropdown

### Task Creation

- Modal form with validation
- Required fields: title, due date, priority
- Due date must be today or in the future
- Prevents duplicate titles on same due date

### Reports

- Select any date to view task statistics
- Shows count of tasks by priority and status
- Displays overdue tasks with details
- Real-time updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
