import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import PhoneInput from "react-phone-input-2";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import { Container, TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Alert, InputAdornment, IconButton } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  gender: yup.string().required('Gender is required'),
  phnumber: yup.string().matches(/^(\+[1-9]{1,4}[0-9]{3,4})?([0-9]{9,14})$/, 'Phone number is not valid').required('Phone number is required'),
  dob: yup.date().required('Date of Birth is required'),
  email: yup.string()
    .email('Invalid email')
    .matches(/^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/, 'Invalid email')
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8}/, 'Password must be at least 8 characters, include an uppercase letter, a number, and a special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Signup = () => {
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setApiError('Passwords do not match');
      return;
    }

    try {
      await axios.post("https://travelbuddy-user-service-production.up.railway.app/users/register", data);
      setSuccessMessage('Registration Successful');
      setApiError('');
    } catch (err) {
      const errorMessages = err.response?.data?.errors || [err.response?.data?.message || 'An error occurred. Please choose different Username.'];
      setApiError(errorMessages);
    }
  };

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
          Sign Up
        </Typography>
        {apiError && <Alert severity="error">{apiError}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                error={!!errors.username}
                helperText={errors.username ? errors.username.message : ''}
              />
            )}
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
          <Controller
            name="phnumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Box margin="normal" sx={{ mt: 3 }}>
                <PhoneInput
                  country={'in'}
                  value={field.value}
                  onChange={value => field.onChange(value)}
                  inputStyle={{ width: '100%' }}
                />
              </Box>
            )}
          />
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
                  error={!!errors.dob}
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
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
