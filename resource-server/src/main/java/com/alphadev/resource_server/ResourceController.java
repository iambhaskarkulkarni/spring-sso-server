package com.alphadev.resource_server;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
public class ResourceController {

    @GetMapping("/resource")
    public Map<String, Object> resource(@AuthenticationPrincipal Jwt jwt) {
        return Collections.singletonMap("resource", "This is a protected resource. JWT subject: " + jwt.getSubject());
    }

    @GetMapping("/user-info")
    public Map<String, Object> userInfo(@AuthenticationPrincipal Jwt jwt) {
        return Collections.singletonMap("claims", jwt.getClaims());
    }
}
