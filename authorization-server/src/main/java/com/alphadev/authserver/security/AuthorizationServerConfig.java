package com.alphadev.authserver.security;

import com.alphadev.authserver.config.JwtConfig;
import com.alphadev.authserver.services.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class AuthorizationServerConfig {

    private final CustomUserDetailsService customUserDetailsService;
//    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final JwtConfig jwtConfig;

    public AuthorizationServerConfig(CustomUserDetailsService customUserDetailsService,
//                                     CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
                                     JwtConfig jwtConfig) {
        this.customUserDetailsService = customUserDetailsService;
//        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
        this.jwtConfig = jwtConfig;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(customUserDetailsService);
        return daoAuthenticationProvider;
    }


    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = OAuth2AuthorizationServerConfigurer
                .authorizationServer();
        RequestMatcher endpointsMatcher = authorizationServerConfigurer.getEndpointsMatcher();
        http
                .with(authorizationServerConfigurer,
                        oAuth2AuthorizationServerConfigurer -> {
                                oAuth2AuthorizationServerConfigurer
                                        .oidc(Customizer.withDefaults())
                                        .tokenGenerator(jwtConfig.tokenGenerator());
                        })
                .securityMatcher(endpointsMatcher)
                .authorizeHttpRequests(authorize -> authorize.
                        anyRequest().authenticated())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session
                        .maximumSessions(1)
                )
                .formLogin(Customizer.withDefaults());
        return http.build();
    }

    // CORS configuration to allow requests from React app
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addAllowedOrigin("http://localhost:5175");
        config.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher();
    }

}
