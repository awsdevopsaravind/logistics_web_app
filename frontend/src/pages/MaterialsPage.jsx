import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ name: '', costPerTon: '', costPerCubicMeter: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.costPerTon || !form.costPerCubicMeter) return;
    setMaterials([...materials, { ...form }]);
    setForm({ name: '', costPerTon: '', costPerCubicMeter: '' });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Material Types</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleAdd}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField label="Material Name" name="name" value={form.name} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Cost per Ton" name="costPerTon" value={form.costPerTon} onChange={handleChange} type="number" fullWidth required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Cost per Cubic Meter" name="costPerCubicMeter" value={form.costPerCubicMeter} onChange={handleChange} type="number" fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Add Material</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Material List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Cost per Ton</TableCell>
              <TableCell>Cost per Cubic Meter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.map((mat, idx) => (
              <TableRow key={idx}>
                <TableCell>{mat.name}</TableCell>
                <TableCell>{mat.costPerTon}</TableCell>
                <TableCell>{mat.costPerCubicMeter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
} 