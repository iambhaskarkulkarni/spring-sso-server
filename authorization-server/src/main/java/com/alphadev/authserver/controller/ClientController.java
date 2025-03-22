package com.alphadev.authserver.controller;

import com.alphadev.authserver.dto.ClientRegistrationRequest;
import com.alphadev.authserver.dto.ClientRegistrationResponse;
import com.alphadev.authserver.services.JpaRegisteredClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final RegisteredClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JpaRegisteredClientRepository registeredClientRepository;


    @Autowired
    public ClientController(RegisteredClientRepository clientRepository, PasswordEncoder passwordEncoder, JpaRegisteredClientRepository registeredClientRepository) {
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.registeredClientRepository = registeredClientRepository;
    }

    @GetMapping
    public ResponseEntity<?> getClients() {
        List<RegisteredClient> allRegisteredClient = registeredClientRepository.findAllRegisteredClient();
        if(allRegisteredClient != null && allRegisteredClient.isEmpty()) {
           return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(allRegisteredClient.stream().map(this::mapToDto).toList());
    }

    @PostMapping
    public ResponseEntity<ClientRegistrationResponse> registerClient(@RequestBody ClientRegistrationRequest request) {
        // Generate a client secret (if needed)
        String clientSecret = null;
        if (request.isConfidentialClient()) {
            clientSecret = UUID.randomUUID().toString();
        }

        // Create the RegisteredClient
        RegisteredClient.Builder clientBuilder = RegisteredClient.withId(UUID.randomUUID().toString())
                .clientId(request.getClientId())
                .clientName(request.getClientName())
                .clientIdIssuedAt(Instant.now());

        // Set client secret for confidential clients
        if (clientSecret != null) {
            clientBuilder
                    .clientSecret(passwordEncoder.encode(clientSecret))
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC);
        } else {
            clientBuilder.clientAuthenticationMethod(ClientAuthenticationMethod.NONE);
        }

        // Add grant types
        for (String grantType : request.getGrantTypes()) {
            switch (grantType) {
                case "authorization_code":
                    clientBuilder.authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE);
                    break;
                case "refresh_token":
                    clientBuilder.authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN);
                    break;
                case "client_credentials":
                    clientBuilder.authorizationGrantType(AuthorizationGrantType.CLIENT_CREDENTIALS);
                    break;
                default:
                    clientBuilder.authorizationGrantType(new AuthorizationGrantType(grantType));
            }
        }

        // Add redirect URIs
        for (String redirectUri : request.getRedirectUris()) {
            clientBuilder.redirectUri(redirectUri);
        }

        // Add scopes
        for (String scope : request.getScopes()) {
            clientBuilder.scope(scope);
        }

        // Configure client settings
        ClientSettings.Builder clientSettingsBuilder = ClientSettings.builder();
        clientSettingsBuilder.requireAuthorizationConsent(request.isRequireUserConsent());

        // For PKCE clients
        if (request.isRequirePkce()) {
            clientSettingsBuilder.requireProofKey(true);
        }

        clientBuilder.clientSettings(clientSettingsBuilder.build());

        // Configure token settings
        TokenSettings.Builder tokenSettingsBuilder = TokenSettings.builder();
        tokenSettingsBuilder.accessTokenTimeToLive(Duration.ofMinutes(request.getAccessTokenValidity()));
        tokenSettingsBuilder.refreshTokenTimeToLive(Duration.ofDays(request.getRefreshTokenValidity()));
        clientBuilder.tokenSettings(tokenSettingsBuilder.build());

        // Save the client
        RegisteredClient registeredClient = clientBuilder.build();
        clientRepository.save(registeredClient);

        // Return the client information and secret
        ClientRegistrationResponse response = new ClientRegistrationResponse(
                registeredClient.getClientId(),
                clientSecret,
                "Client registered successfully"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<?> getClient(@PathVariable String clientId) {
        System.out.println("Fetching client with ID: " + clientId);
        RegisteredClient client = clientRepository.findByClientId(clientId);
        if (client == null) {
            return ResponseEntity.notFound().build();
        }

        // Convert to DTO and return (exclude sensitive data like client secret)
        return ResponseEntity.ok(mapToDto(client));
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<?> deleteClient(@PathVariable String clientId) {
        // Note: Spring's RegisteredClientRepository doesn't have a delete method
        // You'll need to use your JPA repository directly or add a delete method
        // to your JpaRegisteredClientRepository implementation

        // This is a placeholder - implement actual deletion logic
        return ResponseEntity.ok().build();
    }

    private Object mapToDto(RegisteredClient client) {
        System.out.println("Got the request for registered client - "+client);
        ClientRegistrationRequest clientRegistrationRequest = new ClientRegistrationRequest();
        clientRegistrationRequest.setClientId(client.getClientId());
        clientRegistrationRequest.setClientName(client.getClientName());
        clientRegistrationRequest.setRedirectUris(client.getRedirectUris());
        clientRegistrationRequest.setRedirectUris(client.getRedirectUris());
        clientRegistrationRequest.setScopes(client.getScopes());
        clientRegistrationRequest.setRequireUserConsent(client.getClientSettings().isRequireAuthorizationConsent());
        clientRegistrationRequest.setRequirePkce(client.getClientSettings().isRequireProofKey());
        clientRegistrationRequest.setAccessTokenValidity(client.getTokenSettings().getAccessTokenTimeToLive().getNano());
        clientRegistrationRequest.setRefreshTokenValidity(client.getTokenSettings().getRefreshTokenTimeToLive().getNano());
        return clientRegistrationRequest;
    }
}