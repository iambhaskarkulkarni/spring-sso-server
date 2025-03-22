package com.alphadev.authserver.dto;

public class ClientRegistrationResponse {
    private String clientId;
    private String clientSecret;
    private String message;

    public ClientRegistrationResponse(String clientId, String clientSecret, String message) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.message = message;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
