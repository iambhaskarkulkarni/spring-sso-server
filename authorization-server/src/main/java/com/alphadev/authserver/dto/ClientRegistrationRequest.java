package com.alphadev.authserver.dto;

import java.util.Set;

public class ClientRegistrationRequest {
    private String clientId;
    private String clientName;
    private Set<String> redirectUris;
    private Set<String> grantTypes;
    private Set<String> scopes;
    private boolean confidentialClient;
    private boolean requireUserConsent;
    private boolean requirePkce;
    private int accessTokenValidity = 30; // minutes
    private int refreshTokenValidity = 30; // days

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Set<String> getRedirectUris() {
        return redirectUris;
    }

    public void setRedirectUris(Set<String> redirectUris) {
        this.redirectUris = redirectUris;
    }

    public Set<String> getGrantTypes() {
        return grantTypes;
    }

    public void setGrantTypes(Set<String> grantTypes) {
        this.grantTypes = grantTypes;
    }

    public Set<String> getScopes() {
        return scopes;
    }

    public void setScopes(Set<String> scopes) {
        this.scopes = scopes;
    }

    public boolean isConfidentialClient() {
        return confidentialClient;
    }

    public void setConfidentialClient(boolean confidentialClient) {
        this.confidentialClient = confidentialClient;
    }

    public boolean isRequireUserConsent() {
        return requireUserConsent;
    }

    public void setRequireUserConsent(boolean requireUserConsent) {
        this.requireUserConsent = requireUserConsent;
    }

    public boolean isRequirePkce() {
        return requirePkce;
    }

    public void setRequirePkce(boolean requirePkce) {
        this.requirePkce = requirePkce;
    }

    public int getAccessTokenValidity() {
        return accessTokenValidity;
    }

    public void setAccessTokenValidity(int accessTokenValidity) {
        this.accessTokenValidity = accessTokenValidity;
    }

    public int getRefreshTokenValidity() {
        return refreshTokenValidity;
    }

    public void setRefreshTokenValidity(int refreshTokenValidity) {
        this.refreshTokenValidity = refreshTokenValidity;
    }
}
