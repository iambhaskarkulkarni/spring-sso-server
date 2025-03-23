import { GridColDef } from "@mui/x-data-grid";

export const formConfig = [
  {
    type: 'text',
    name: 'clientId',
    label: 'Client ID',
  },
  {
    type: 'text',
    name: 'clientSecret',
    label: 'Client Secret',
  },

  {
    type: 'multi-select',
    name: 'authorizedGrantTypes',
    label: 'Authorized Grant Types',
    options: [
      { value: 'authorization_code', label: 'Authorization Code' },
      { value: 'password', label: 'Password' },
      { value: 'client_credentials', label: 'Client Credentials' },
      { value: 'refresh_token', label: 'Refresh Token' },
    ],
  },
  {
    type: 'single-select',
    name: 'scope',
    label: 'Scope',
    options: [
      { value: 'read', label: 'Read' },
      { value: 'write', label: 'Write' },
      { value: 'read_write', label: 'Read/Write' },
    ],
  },
  {
    type: 'text',
    name: 'redirectUri',
    label: 'Redirect URI',
  },
  {
    type: 'text',
    name: 'accessTokenDuration',
    label: 'Access Token Duration',
  },
  {
    type: 'text',
    name: 'refreshTokenDuration',
    label: 'Refresh Token Duration',
  },
];

// Columns definition
  export const columns: GridColDef[] = [
    { field: 'id', headerName: 'Client Id', width: 200 },
    { field: 'name', headerName: 'Client Name', width: 200 },
    { field: 'RedirectUris', headerName: 'RedirectUris', width: 300  },
    { field: 'grantTypes', headerName: 'Grant Types', width: 200 },
    { field: 'scopes', headerName: 'Scopes', width: 200 },
    { field: 'refreshTokenValidity', headerName: 'Refresh Token Validity', width: 200 },
    { field: 'accessTokenValidity', headerName: 'Access Token Validity', width: 200 },
  ];