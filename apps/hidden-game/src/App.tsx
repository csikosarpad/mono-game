import React, { useState } from 'react';
//import styled from 'styled-components';
//import './App.scss';

// const Container = styled.div`
//   @apply flex flex-col items-center justify-center min-h-screen bg-gray-100;
// `;

export default function App() {
    const [message, setMessage] = useState('Üdv a Hidden Game mintában!');
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Hidden Game</h1>
            <p className="mb-4">{message}</p>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setMessage('Játék logika ide jön majd!')}
            >
                Start
            </button>
        </div>
    );
}
