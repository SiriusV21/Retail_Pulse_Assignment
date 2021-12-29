import { useState, useEffect } from 'react';
import ContestsList from './routes/ContestsList';
import ContestDetails from './routes/ContestDetails';
import { Routes, Route } from 'react-router-dom';
import './App.css';

const App = () => {
    const [contest, setContest] = useState();

    return (
        <Routes>
            <Route
                exact
                path='/'
                element={<ContestsList setContest={setContest} />}
            />
            <Route
                exact
                path='/contest/:id'
                element={
                    <ContestDetails contest={contest} setContest={setContest} />
                }
            />
        </Routes>
    );
};

export default App;
