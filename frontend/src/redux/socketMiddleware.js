// frontend/src/redux/socketMiddleware.js
import { io } from 'socket.io-client';
import { serverUrl } from '../App'; 

// Import any action creators you need to dispatch from the middleware
// For example: import { updateDeliveryLocation } from './mapSlice';

const socketMiddleware = () => {
  let socket;

  return storeAPI => next => action => {
    const { getState } = storeAPI;
    const { userData } = getState().user;

    // The middleware intercepts actions with a 'socket/' prefix
    if (action.type.startsWith('socket/')) {
      
      // Action to connect and set up listeners
      if (action.type === 'socket/connect' && !socket) {
        socket = io(serverUrl, { withCredentials: true });

        socket.on('connect', () => {
          console.log('Socket connected successfully!');
          // Once connected, identify the user if they exist
          if (userData) {
            socket.emit('identity', { userId: userData._id });
          }
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected.');
          socket = null; // Clean up the instance
        });

        // Listen for server events and dispatch regular Redux actions
        socket.on('updateDeliveryLocation', (data) => {
          // 'data' is the serializable payload from your server
          // Dispatch a regular action to update the state
          console.log('Received delivery location update:', data);
          // dispatch(updateDeliveryLocation(data)); // Example
        });
      }

      // Action to disconnect
      if (action.type === 'socket/disconnect' && socket) {
        socket.disconnect();
      }

      // Action to emit an event
      // The payload for this action should be { event: 'eventName', data: {...} }
      if (action.type === 'socket/emit' && socket) {
        const { event, data } = action.payload;
        socket.emit(event, data);
      }
    }

    // Let the action pass through to the reducers
    return next(action);
  };
};

export default socketMiddleware();
