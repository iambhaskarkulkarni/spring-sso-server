package com.alphadev.authserver.config;

import com.alphadev.authserver.entities.Role;
import com.alphadev.authserver.entities.MyUser;
import com.alphadev.authserver.repositories.RoleRepository;
import com.alphadev.authserver.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Configuration
public class ClientInitializer {

    @Bean
    CommandLineRunner initClient(RegisteredClientRepository registeredClientRepository,
                                 UserRepository userRepository,
                                 RoleRepository roleRepository,
                                 PasswordEncoder passwordEncoder
    ) {
        return args -> {
            initializeClients(registeredClientRepository);
//            initializeUsers(userRepository, roleRepository, passwordEncoder);
        };
    }

    public void initializeClients(RegisteredClientRepository registeredClientRepository) {
        if (registeredClientRepository.findByClientId("public-client") == null) {
            RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                    .clientId("public-client")
//                .clientSecret("{noop}secret") // {noop} for plaintext; use an encoder in production.
                    .clientAuthenticationMethod(ClientAuthenticationMethod.NONE)
                    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                    .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                    // The redirect URI to which the authorization server will send the authorization code.
                    .redirectUri("http://127.0.0.1:4200")
                    // Define the scopes your client will have access to.
                    .scope(OidcScopes.OPENID)
                    .scope(OidcScopes.EMAIL)
                    .clientSettings(ClientSettings.builder()
                            .requireAuthorizationConsent(true)
                            .requireProofKey(true)
                            .build())
                    .tokenSettings(TokenSettings.builder()
                            .accessTokenTimeToLive(Duration.ofMinutes(30))
                            .build())
                    .build();
            registeredClientRepository.save(registeredClient);
            System.out.println("public client already saved to DB.");
        } else {
            System.out.println("public client already exists!");
        }
    }

    public void initializeUsers(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        List<String> roles = List.of("ADMIN", "USER", "MODERATOR");

        for (String roleName : roles) {
            roleRepository.findByName(roleName)
                    .orElseGet(() -> {
                        Role role = new Role(roleName);
                        return roleRepository.save(role);
                    });
        }

        Set<Role> roles_1 = Set.of(
                roleRepository.findByName("ADMIN").get(),
                roleRepository.findByName("USER").get(),
                roleRepository.findByName("MODERATOR").get()
        );
        String password = passwordEncoder.encode("password");

        List<MyUser> users = List.of(
                new MyUser("bhaskar",password, roles_1),
                new MyUser("aishwarya_huchii",password, roles_1),
                new MyUser("preeti_patil",password, roles_1)
        );

        for (MyUser user : users) {
            userRepository.save(user);
        }
    }
}
