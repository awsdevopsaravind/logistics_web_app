import React, { useState } from 'react';
import { Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Checkbox, IconButton, Box, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function QuarryOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    ownerName: '',
    quarryName: '',
    location: '',
    contactPerson: '',
    phone: '',
    ratePerTon: '',
    gstNumber: '',
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
    if (!form.ownerName || !form.quarryName || !form.location || !form.ratePerTon) return;
    // Duplicate check (ownerName + quarryName + location)
    const duplicate = owners.some(o =>
      o.ownerName.trim().toLowerCase() === form.ownerName.trim().toLowerCase() &&
      o.quarryName.trim().toLowerCase() === form.quarryName.trim().toLowerCase() &&
      o.location.trim().toLowerCase() === form.location.trim().toLowerCase()
    );
    if (duplicate) {
      setError('This quarry owner already exists for the given quarry and location.');
      return;
    }
    setOwners([
      ...owners.map(o => ({ ...o, active: form.active ? false : o.active })),
      { ...form }
    ]);
    setForm({ ownerName: '', quarryName: '', location: '', contactPerson: '', phone: '', ratePerTon: '', gstNumber: '', active: false });
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
      o.quarryName.trim().toLowerCase() === editRow.quarryName.trim().toLowerCase() &&
      o.location.trim().toLowerCase() === editRow.location.trim().toLowerCase()
    );
    if (duplicate) {
      setError('This quarry owner already exists for the given quarry and location.');
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
    setForm({ ownerName: '', quarryName: '', location: '', contactPerson: '', phone: '', ratePerTon: '', gstNumber: '', active: false });
    setError('');
    setOpen(true);
  };
  const handleDialogClose = () => {
    setOpen(false);
    setError('');
  };

  return (
    <Box sx={{ mt: 0 }}>
      <Typography variant="h4" gutterBottom>Quarry Owners</Typography>
      {owners.length === 0 ? (
        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>There are no quarry owners. Please click <b>Add Quarry Owner Info</b> to add details.</Typography>
          <Button variant="contained" onClick={handleDialogOpen}>Add Quarry Owner Info</Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" onClick={handleDialogOpen}>Add Quarry Owner Info</Button>
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
                  <TableCell>Quarry Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Rate per Ton</TableCell>
                  <TableCell>GST Number</TableCell>
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
                        <TableCell><TextField name="quarryName" value={editRow.quarryName} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="location" value={editRow.location} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="contactPerson" value={editRow.contactPerson} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="phone" value={editRow.phone} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><TextField name="ratePerTon" value={editRow.ratePerTon} onChange={handleEditChange} type="number" size="small" /></TableCell>
                        <TableCell><TextField name="gstNumber" value={editRow.gstNumber} onChange={handleEditChange} size="small" /></TableCell>
                        <TableCell><Checkbox name="active" checked={editRow.active} onChange={handleEditChange} /></TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleUpdate(idx)}><SaveIcon /></IconButton>
                          <IconButton color="secondary" onClick={handleCancel}><CancelIcon /></IconButton>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{owner.ownerName}</TableCell>
                        <TableCell>{owner.quarryName}</TableCell>
                        <TableCell>{owner.location}</TableCell>
                        <TableCell>{owner.contactPerson}</TableCell>
                        <TableCell>{owner.phone}</TableCell>
                        <TableCell>{owner.ratePerTon}</TableCell>
                        <TableCell>{owner.gstNumber}</TableCell>
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
        <DialogTitle>Add Quarry Owner Info</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form id="quarry-owner-form" onSubmit={handleAdd}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <TextField label="Owner Name" name="ownerName" value={form.ownerName} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Quarry Name" name="quarryName" value={form.quarryName} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Location" name="location" value={form.location} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="Rate per Ton" name="ratePerTon" value={form.ratePerTon} onChange={handleChange} type="number" fullWidth required />
              </Grid>
              <Grid item xs={12} md={1.5}>
                <TextField label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} fullWidth />
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
          <Button type="submit" form="quarry-owner-form" variant="contained">Add Owner</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 