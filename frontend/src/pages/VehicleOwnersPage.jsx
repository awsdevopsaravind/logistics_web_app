import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, IconButton, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function VehicleOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    ownerName: '',
    vehicleNumber: '',
    phone: '',
    gstNumber: '',
    ratePerTon: '',
    location: '',
    active: false,
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
    if (!form.ownerName || !form.vehicleNumber || !form.phone) return;
    // Duplicate check
    const duplicate = owners.some(o =>
      o.ownerName.trim().toLowerCase() === form.ownerName.trim().toLowerCase() &&
      o.vehicleNumber.trim().toLowerCase() === form.vehicleNumber.trim().toLowerCase()
    );
    if (duplicate) {
      setError('This vehicle owner and vehicle number already exists.');
      return;
    }
    setOwners([
      ...owners.map(o => ({ ...o, active: form.active ? false : o.active })),
      { ...form }
    ]);
    setForm({ ownerName: '', vehicleNumber: '', phone: '', gstNumber: '', ratePerTon: '', location: '', active: false });
    setOpen(false);
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow({ ...owners[idx] });
    setError('');
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditRow({ ...editRow, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUpdate = (idx) => {
    setError('');
    // Duplicate check (ignore current row)
    const duplicate = owners.some((o, i) =>
      i !== idx &&
      o.ownerName.trim().toLowerCase() === editRow.ownerName.trim().toLowerCase() &&
      o.vehicleNumber.trim().toLowerCase() === editRow.vehicleNumber.trim().toLowerCase()
    );
    if (duplicate) {
      setError('This vehicle owner and vehicle number already exists.');
      return;
    }
    setOwners(owners.map((o, i) => i === idx ? { ...editRow } : (editRow.active ? { ...o, active: false } : o)));
    setEditIdx(null);
    setEditRow({});
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditRow({});
    setError('');
  };

  const handleDelete = (idx) => {
    setOwners(owners.filter((_, i) => i !== idx));
    setSelected(selected.filter(i => i !== idx));
  };

  const handleSelect = (idx) => {
    setSelected(selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(owners.map((_, i) => i));
    } else {
      setSelected([]);
    }
  };

  const handleBulkDelete = () => {
    setOwners(owners.filter((_, i) => !selected.includes(i)));
    setSelected([]);
  };

  const handleDialogOpen = () => {
    setForm({ ownerName: '', vehicleNumber: '', phone: '', gstNumber: '', ratePerTon: '', location: '', active: false });
    setError('');
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    setError('');
  };

  return (
    <Box sx={{ mt: 0 }}>
      <Typography variant="h4" gutterBottom>Vehicle Owners</Typography>
      {owners.length === 0 ? (
        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>There are no vehicle owners. Please click <b>Add Owner Info</b> to add vehicle owner details.</Typography>
          <Button variant="contained" onClick={handleDialogOpen}>Add Owner Info</Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" onClick={handleDialogOpen}>Add Owner Info</Button>
          </Box>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" gutterBottom>Owners List</Typography>
              <Button variant="outlined" color="error" disabled={selected.length === 0} onClick={handleBulkDelete}>Delete Selected</Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.length === owners.length && owners.length > 0} indeterminate={selected.length > 0 && selected.length < owners.length} onChange={handleSelectAll} />
                  </TableCell>
                  <TableCell>Owner Name</TableCell>
                  <TableCell>Vehicle Number</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>GST Number</TableCell>
                  <TableCell>Rate per Ton</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {owners.map((owner, idx) => (
                  <TableRow key={idx} selected={selected.includes(idx)}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.includes(idx)} onChange={() => handleSelect(idx)} />
                    </TableCell>
                    {editIdx === idx ? (
                      <>
                        <TableCell><TextField name="ownerName" value={editRow.ownerName} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="vehicleNumber" value={editRow.vehicleNumber} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="phone" value={editRow.phone} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="gstNumber" value={editRow.gstNumber} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="ratePerTon" value={editRow.ratePerTon} onChange={handleEditChange} type="number" size="small" /></TableCell>
                        <TableCell><TextField name="location" value={editRow.location} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><Checkbox name="active" checked={editRow.active} onChange={handleEditChange} /></TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleUpdate(idx)}><SaveIcon /></IconButton>
                          <IconButton color="secondary" onClick={handleCancel}><CancelIcon /></IconButton>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{owner.ownerName}</TableCell>
                        <TableCell>{owner.vehicleNumber}</TableCell>
                        <TableCell>{owner.phone}</TableCell>
                        <TableCell>{owner.gstNumber}</TableCell>
                        <TableCell>{owner.ratePerTon}</TableCell>
                        <TableCell>{owner.location}</TableCell>
                        <TableCell>{owner.active ? '✔️' : ''}</TableCell>
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
        <DialogTitle>Add Owner Info</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form id="owner-info-form" onSubmit={handleAdd}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <TextField label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Vehicle Number" name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Rate per Ton" name="ratePerTon" value={form.ratePerTon} onChange={handleChange} type="number" fullWidth />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox name="active" checked={form.active} onChange={handleChange} />
                <Typography>Active</Typography>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button type="submit" form="owner-info-form" variant="contained">Add Owner</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 