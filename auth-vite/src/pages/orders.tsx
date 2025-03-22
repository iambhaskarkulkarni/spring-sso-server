import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import CustomizedDataGrid from '../components/CustomizedDataGrid';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Button, TextField, Box} from '@mui/material';
import { Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import { useSession } from '../SessionContext';
import GenericModal from '../components/GenericModal';
import TextFieldComponent from '../components/TextFieldComponent';
import MultiSelectComponent from '../components/MultiSelectComponent';
import SingleSelectComponent from '../components/SingleSelectComponent';

export default function OrdersPage() {
  const requestFired = React.useRef(false);
  const { setSession } = useSession();
  const [open, setOpen] = useState(false); // State to control the modal
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    clientSecret: '',
    scope: '',
    authorizedGrantTypes: [],
    redirectUri: '',
  });

  // State to store the rows fetched from the API
  const [rows, setRows] = React.useState<GridRowsProp>([]);

  // Columns definition
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Client Id', width: 200 },
    { field: 'name', headerName: 'Client Name', width: 200 },
    { field: 'RedirectUris', headerName: 'RedirectUris', width: 300  },
    { field: 'grantTypes', headerName: 'Grant Types', width: 200 },
    { field: 'scopes', headerName: 'Scopes', width: 200 },
    { field: 'refreshTokenValidity', headerName: 'Refresh Token Validity', width: 200 },
    { field: 'accessTokenValidity', headerName: 'Access Token Validity', width: 200 },
  ];

  // Fetch data from the API when the component mounts
  React.useEffect(() => {
    if (!requestFired.current) {
      console.log('Component loaded. Firing request...');
      fireRequest();
      requestFired.current = true; // Mark the request as fired
    }
  }, []);

  const fireRequest = async () => {
    console.log(`Access token in order page - ${localStorage.getItem('access_token')}`);

    try {
      const response = await axios.get('http://localhost:8080/api/clients', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Include the access token
        },
      });

      // Handle successful response
      if (response.status === 200) {
        // Transform the API response into the format expected by GridRowsProp
        const apiData = response.data; // Assuming the API returns an array of objects
        const formattedRows = apiData.map((item: any) => ({
          id: item.clientName, // Replace with the actual field names from your API response
          name: item.clientId,
          RedirectUris: item.redirectUris,
          grantTypes: item.grantTypes,
          scopes: item.scopes,
          refreshTokenValidity: item.refreshTokenValidity,
          accessTokenValidity: item.accessTokenValidity
        }));

        // Update the rows state with the fetched data
        setRows(formattedRows);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // // Send the form data to the Spring Authorization Server API
      // const response = await axios.post('http://localhost:8080/api/clients', formData, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      //   },
      // });

      // if (response.status === 201) {
      //   console.log('Client created successfully');
      //   setOpen(false); // Close the modal
      //   // Optionally, refresh the data grid here
      // }

       // Simulate an API call
       await new Promise((resolve) => setTimeout(resolve, 2000));
       console.log('Form submitted:', formData);
       setOpen(false);
    } catch (error) {
      console.error('Error creating client:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the Add button click
  const handleAddButtonClick = () => {
    setOpen(true); // Open the modal
  };

   // Generic handler for text and select fields
   const handleFieldChange = (name: string, value: string | string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const modalContent = (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2, // Add spacing between columns
      }}
    >
      {/* First Column */}
      <Box sx={{ flex: 1, minWidth: '200px' }}>
        <TextFieldComponent
          name="clientId"
          label="Client ID"
          value={formData.clientId}
          onChange={handleFieldChange}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: '200px' }}>
        <TextFieldComponent
          name="clientSecret"
          label="Client Secret"
          value={formData.clientSecret}
          onChange={handleFieldChange}
        />
      </Box>

      {/* Second Column */}
      <Box sx={{ flex: 1, minWidth: '200px' }}>
        <SingleSelectComponent
          name="scope"
          label="Scope"
          value={formData.scope}
          options={[
            { value: 'read', label: 'Read' },
            { value: 'write', label: 'Write' },
            { value: 'read_write', label: 'Read/Write' },
          ]}
          onChange={handleFieldChange}
        />
      </Box>
      <Box sx={{ flex: 1, minWidth: '200px' }}>
        <MultiSelectComponent
          name="authorizedGrantTypes"
          label="Authorized Grant Types"
          value={formData.authorizedGrantTypes}
          options={[
            { value: 'authorization_code', label: 'Authorization Code' },
            { value: 'password', label: 'Password' },
            { value: 'client_credentials', label: 'Client Credentials' },
            { value: 'refresh_token', label: 'Refresh Token' },
          ]}
          onChange={handleFieldChange}
        />
      </Box>

      {/* Full-width Field */}
      <Box sx={{ width: '100%' }}>
        <TextFieldComponent
          name="redirectUri"
          label="Redirect URI"
          value={formData.redirectUri}
          onChange={handleFieldChange}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <TextFieldComponent
          name="accessTokenDuration"
          label="Acess Token Duration"
          value={formData.redirectUri}
          onChange={handleFieldChange}
        />
      </Box>
    </Box>
  );

  // Define the modal actions
  const modalActions = (
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleSubmit} color="primary">
        Save
      </Button>
    </>
  );

  return (
    <div>
      <CustomizedDataGrid rows={rows} columns={columns} onAddButtonClick={handleAddButtonClick} />
      {/* Generic Modal */}
      <GenericModal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New User"
        content={modalContent}
        actions={modalActions}
        width={600} // Set custom width
        loading={loading} // Pass loading state
        sx={{ padding: 3 }} // Add custom styles
      />
    </div>
  );
}