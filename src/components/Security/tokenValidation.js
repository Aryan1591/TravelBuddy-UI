import {jwtDecode} from 'jwt-decode';

const isTokenExpired = () => {
  const token = sessionStorage.getItem('jwtToken');
  console.log("Token in this js "+token);
  if (!token) return true;

  try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken.username);
    console.log(decodedToken);
    const currentTime = Date.now() / 1000; // current time in seconds
    return decodedToken.exp < currentTime; // returns true if token is expired
  } catch (e) {
    return true; // Invalid token or error in decoding
  }
};

export default isTokenExpired;
