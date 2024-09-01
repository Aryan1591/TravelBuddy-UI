import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-input-2";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import { Container, TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Alert, FormControlLabel, Switch } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

// Validation schema
const schema = yup.object().shape({
  gender: yup.string().required('Gender is required'),
  phnumber: yup.string().matches(/^(\+[1-9]{1,4}[0-9]{3,4})?([0-9]{9,14})$/, 'Phone number is not valid').required('Phone number is required'),
  dob: yup.date().required('Date of Birth is required'),
  email: yup.string()
    .email('Invalid email')
    .matches(/^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/, 'Invalid email')
    .required('Email is required'),
  showPhoneNumber: yup.boolean().required(),
});

const AboutMe = ({ username }) => {
  const { handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`https://travelbuddy-user-service-production.up.railway.app/users/getInfo/${username}`);
        const userInfo = response.data;

        // Set form values
        setValue('gender', userInfo.gender);
        setValue('phnumber', userInfo.phnumber);
        setValue('dob', new Date(userInfo.dob));
        setValue('email', userInfo.email);
        setValue('showPhoneNumber', userInfo.phnum_visibility); // Set showPhoneNumber based on phnum_visibility

        setLoading(false);
      } catch (err) {
        setApiError('Failed to fetch user information');
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [username, setValue]);

  const onSubmit = async (data) => {
    setUpdating(true);
    try {
      await axios.put(`https://travelbuddy-user-service-production.up.railway.app/users/updateInfo/${username}`, {
        ...data,
        phnum_visibility: data.showPhoneNumber // Send showPhoneNumber as phnum_visibility
      });
      setSuccessMessage('Information updated successfully');
      setApiError('');
    } catch (err) {
      const errorMessages = err.response?.data?.errors || [err.response?.data?.message || 'Failed to update information'];
      setApiError(errorMessages);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete(`https://travelbuddy-user-service-production.up.railway.app/users/deleteAccount/${username}`);
      setSuccessMessage('Account deleted successfully');
      setApiError('');
      // Optionally, you can add code here to redirect the user or clear user data from local state/storage
    } catch (err) {
      setApiError('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          About Me
        </Typography>
        {apiError && <Alert severity="error">{apiError}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            value={username}
            disabled
          />
          <FormControl fullWidth margin="normal" error={!!errors.gender}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="gender-label"
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              )}
            />
            {errors.gender && <Typography variant="caption" color="error">{errors.gender.message}</Typography>}
          </FormControl>
          <Box margin="normal" sx={{ mt: 3 }}>
            <Controller
              name="phnumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PhoneInput
                  country={'in'}
                  value={field.value}
                  onChange={value => field.onChange(value)}
                  inputStyle={{ width: '100%' }}
                />
              )}
            />
          </Box>
          {errors.phnumber && <Typography variant="caption" color="error">{errors.phnumber.message}</Typography>}
          <Controller
            name="dob"
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <Box margin="normal" sx={{ mt: 3 }}>
                <DatePicker
                  maxDate={new Date()}
                  selected={field.value}
                  onChange={date => field.onChange(date)}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="Select a date"
                  customInput={<TextField fullWidth label="Date of Birth" />}
                />
              </Box>
            )}
          />
          {errors.dob && <Typography variant="caption" color="error">{errors.dob.message}</Typography>}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
            )}
          />
          <Box margin="normal" sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <Controller
              name="showPhoneNumber"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Show phone number"
                  labelPlacement="start"
                />
              )}
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update'}
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            onClick={handleDeleteAccount}
            disabled={deleting}
            color="error"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AboutMe;
