import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#38BDF8', '#F59E0B', '#10B981', '#EF4444'];

export const DashboardCharts = ({ chartsData }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, height: '100%' }}>
      <Card sx={{ flex: 2, borderRadius: 3, height: '100%' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>Course Completion Trend</Typography>
          <Box sx={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartsData?.course_completion || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="completed" fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
      
      <Card sx={{ flex: 1, borderRadius: 3, height: '100%' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>Training Attendance</Typography>
          <Box sx={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartsData?.training_attendance || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(chartsData?.training_attendance || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {(chartsData?.training_attendance || []).map((entry, index) => (
              <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length], mr: 1 }} />
                <Typography variant="caption">{entry.name}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardCharts;
