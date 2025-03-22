package com.alphadev.authserver.config;

import com.alphadev.authserver.security.JwtTokenCustomizer;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.token.DelegatingOAuth2TokenGenerator;
import org.springframework.security.oauth2.server.authorization.token.JwtGenerator;
import org.springframework.security.oauth2.server.authorization.token.OAuth2AccessTokenGenerator;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.util.FileCopyUtils;

import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.UUID;

@Configuration
public class JwtConfig {

    @Value("${jwt.key.id:auth-key-1}")
    private String keyId;
    private final JwtTokenCustomizer jwtTokenCustomizer;

    public JwtConfig(JwtTokenCustomizer jwtTokenCustomizer) {
        this.jwtTokenCustomizer = jwtTokenCustomizer;
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() throws Exception {
        // Load the RSA keys from files
        ClassPathResource privateKeyResource = new ClassPathResource("certs/private.pem");
        ClassPathResource publicKeyResource = new ClassPathResource("certs/public.pem");

        String privateKeyContent = new String(FileCopyUtils.copyToByteArray(privateKeyResource.getInputStream()));
        String publicKeyContent = new String(FileCopyUtils.copyToByteArray(publicKeyResource.getInputStream()));

        // Strip PEM headers and footers and decode
        privateKeyContent = privateKeyContent
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        publicKeyContent = publicKeyContent
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        // Decode the base64 encoded keys
        byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyContent);
        byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyContent);

        // Generate KeyFactory and create private key
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
        RSAPrivateKey privateKey = (RSAPrivateKey) keyFactory.generatePrivate(privateKeySpec);

        // Create public key
        X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
        RSAPublicKey publicKey = (RSAPublicKey) keyFactory.generatePublic(publicKeySpec);

        // Create RSA key
        RSAKey rsaKey = new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .keyID(keyId)
                .build();

        JWKSet jwkSet = new JWKSet(rsaKey);
        return (jwkSelector, securityContext) -> jwkSelector.select(jwkSet);
    }

    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public OAuth2TokenGenerator<?> tokenGenerator() {
        JwtGenerator jwtGenerator = null;
        try {
            jwtGenerator = new JwtGenerator(new NimbusJwtEncoder(jwkSource()));
            jwtGenerator.setJwtCustomizer(jwtTokenCustomizer);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new DelegatingOAuth2TokenGenerator(jwtGenerator, new OAuth2AccessTokenGenerator());
    }
}
