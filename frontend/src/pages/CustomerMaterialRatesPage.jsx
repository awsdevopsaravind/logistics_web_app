import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, IconButton, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function CustomerMaterialRatesPage() {
  const [rates, setRates] = useState([]);
  const [form, setForm] = useState({
    customer: '',
    material: '',
    rate: '',
    from: '',
    to: '',
    active: false,
    rejectionPercent: '',
    rejectionRemarks: '',
    locationFrom: '',
    locationTo: '',
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError('');
    if (!form.customer || !form.material || !form.rate || !form.from) return;
    // Duplicate check
    const duplicate = rates.some(r =>
      r.customer.trim().toLowerCase() === form.customer.trim().toLowerCase() &&
      r.material.trim().toLowerCase() === form.material.trim().toLowerCase() &&
      r.from === form.from &&
      r.to === form.to
    );
    if (duplicate) {
      setError('A rate for this customer, material, and date duration already exists. Please check your info.');
      return;
    }
    setRates([
      ...rates.map(r => ({ ...r, active: form.active ? false : r.active })),
      { ...form }
    ]);
    setForm({ customer: '', material: '', rate: '', from: '', to: '', active: false, rejectionPercent: '', rejectionRemarks: '', locationFrom: '', locationTo: '' });
    setOpen(false);
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow({ ...rates[idx] });
    setError('');
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditRow({ ...editRow, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUpdate = (idx) => {
    setError('');
    // Duplicate check (ignore current row)
    const duplicate = rates.some((r, i) =>
      i !== idx &&
      r.customer.trim().toLowerCase() === editRow.customer.trim().toLowerCase() &&
      r.material.trim().toLowerCase() === editRow.material.trim().toLowerCase() &&
      r.from === editRow.from &&
      r.to === editRow.to
    );
    if (duplicate) {
      setError('A rate for this customer, material, and date duration already exists. Please check your info.');
      return;
    }
    setRates(rates.map((r, i) => i === idx ? { ...editRow } : (editRow.active ? { ...r, active: false } : r)));
    setEditIdx(null);
    setEditRow({});
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditRow({});
    setError('');
  };

  const handleDelete = (idx) => {
    setRates(rates.filter((_, i) => i !== idx));
    setSelected(selected.filter(i => i !== idx));
  };

  const handleSelect = (idx) => {
    setSelected(selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(rates.map((_, i) => i));
    } else {
      setSelected([]);
    }
  };

  const handleBulkDelete = () => {
    setRates(rates.filter((_, i) => !selected.includes(i)));
    setSelected([]);
  };

  const handleDialogOpen = () => {
    setForm({ customer: '', material: '', rate: '', from: '', to: '', active: false, rejectionPercent: '', rejectionRemarks: '', locationFrom: '', locationTo: '' });
    setError('');
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    setError('');
  };

  return (
    <Box sx={{ mt: 0 }}>
      <Typography variant="h4" gutterBottom>Customer Material Rates</Typography>
      {rates.length === 0 ? (
        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>There are no customer material rates. Please click <b>Add Customer Info</b> to add customer details.</Typography>
          <Button variant="contained" onClick={handleDialogOpen}>Add Customer Info</Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" onClick={handleDialogOpen}>Add Customer Info</Button>
          </Box>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" gutterBottom>Rates List</Typography>
              <Button variant="outlined" color="error" disabled={selected.length === 0} onClick={handleBulkDelete}>Delete Selected</Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.length === rates.length && rates.length > 0} indeterminate={selected.length > 0 && selected.length < rates.length} onChange={handleSelectAll} />
                  </TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Rate (₹/ton)</TableCell>
                  <TableCell>Date From</TableCell>
                  <TableCell>Date To</TableCell>
                  <TableCell>Rejection %</TableCell>
                  <TableCell>Rejection Remarks</TableCell>
                  <TableCell>Location From</TableCell>
                  <TableCell>Location To</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rates.map((rate, idx) => (
                  <TableRow key={idx} selected={selected.includes(idx)}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(idx)} onChange={() => handleSelect(idx)} />
                    </TableCell>
                    {editIdx === idx ? (
                      <>
                        <TableCell><TextField name="customer" value={editRow.customer} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="material" value={editRow.material} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="rate" value={editRow.rate} onChange={handleEditChange} type="number" size="small" /></TableCell>
                        <TableCell><TextField name="from" value={editRow.from} onChange={handleEditChange} type="date" size="small" InputLabelProps={{ shrink: true }} /></TableCell>
                        <TableCell><TextField name="to" value={editRow.to} onChange={handleEditChange} type="date" size="small" InputLabelProps={{ shrink: true }} /></TableCell>
                        <TableCell><TextField name="rejectionPercent" value={editRow.rejectionPercent} onChange={handleEditChange} type="number" size="small" /></TableCell>
                        <TableCell><TextField name="rejectionRemarks" value={editRow.rejectionRemarks} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="locationFrom" value={editRow.locationFrom} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="locationTo" value={editRow.locationTo} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><Checkbox name="active" checked={editRow.active} onChange={handleEditChange} /></TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleUpdate(idx)}><SaveIcon /></IconButton>
                          <IconButton color="secondary" onClick={handleCancel}><CancelIcon /></IconButton>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{rate.customer}</TableCell>
                        <TableCell>{rate.material}</TableCell>
                        <TableCell>{rate.rate}</TableCell>
                        <TableCell>{rate.from}</TableCell>
                        <TableCell>{rate.to}</TableCell>
                        <TableCell>{rate.rejectionPercent}</TableCell>
                        <TableCell>{rate.rejectionRemarks}</TableCell>
                        <TableCell>{rate.locationFrom}</TableCell>
                        <TableCell>{rate.locationTo}</TableCell>
                        <TableCell>{rate.active ? '✔️' : ''}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleEdit(idx)}><EditIcon /></IconButton>
                          <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
      <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Customer Info</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form id="customer-info-form" onSubmit={handleAdd}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <TextField label="Customer Name" name="customer" value={form.customer} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Material Type" name="material" value={form.material} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="Rate (₹/ton)" name="rate" value={form.rate} onChange={handleChange} type="number" fullWidth required />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="Date From" name="from" value={form.from} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth required />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="Date To" name="to" value={form.to} onChange={handleChange} type="date" InputLabelProps={{ shrink: true }} fullWidth />
              </Grid>
              <Grid item xs={12} md={1}>
                <TextField label="Rejection %" name="rejectionPercent" value={form.rejectionPercent} onChange={handleChange} type="number" fullWidth />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Rejection Remarks" name="rejectionRemarks" value={form.rejectionRemarks} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="Location From" name="locationFrom" value={form.locationFrom} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="Location To" name="locationTo" value={form.locationTo} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={0.5} sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox name="active" checked={form.active} onChange={handleChange} />
                <Typography>Active</Typography>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button type="submit" form="customer-info-form" variant="contained">Add Rate</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
