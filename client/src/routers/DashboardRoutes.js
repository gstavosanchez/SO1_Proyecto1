import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MonitorCPU } from '../components/cpu/MonitorCPU';
import { Home } from '../components/home/Home';
import { ProcessChildrens } from '../components/process/ProcessChildrens';
import { MonitorRAM } from '../components/ram/MonitorRAM';
import { Navbar } from '../components/ui/Navbar';

export const DashboardRoutes = () => {
  return (
    <>
      <Navbar />
      <div className="p-5">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/cpu" element={<MonitorCPU />} />
          <Route path="/ram" element={<MonitorRAM />} />
          <Route path="/proces/selected" element={<ProcessChildrens />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
};
