package com.alphadev.authserver.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JwtTokenCustomizer implements OAuth2TokenCustomizer<JwtEncodingContext> {

    @Override
    public void customize(JwtEncodingContext context) {
        Authentication principal = context.getPrincipal();
        if (principal.getAuthorities() != null && !principal.getAuthorities().isEmpty()) {
            Set<String> authorities = principal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            System.out.println("the roles loaded from the db - "+authorities);

            // Add roles as a custom claim
            context.getClaims().claim("roles", authorities);

            // Optionally you can also add a "scope" claim based on authorities
            // context.getClaims().claim("scope", String.join(" ", authorities));
        }
    }
}
