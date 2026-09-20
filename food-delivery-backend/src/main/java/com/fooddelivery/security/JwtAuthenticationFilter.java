package com.fooddelivery.security;

import com.fooddelivery.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Skip JWT validation for public endpoints
        String path = request.getRequestURI();
        if (path.equals("/api/auth/register") || 
            path.equals("/api/auth/login") || 
            path.startsWith("/test/") ||
            path.equals("/error")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String userId = null;

        // Extract token from Authorization header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                userId = jwtUtil.extractUserId(token);
                logger.info("📝 Token extracted - User ID: " + userId);
            } catch (Exception e) {
                logger.error("❌ JWT Token extraction failed: " + e.getMessage());
            }
        } else {
            logger.warn("⚠️ No Authorization header or invalid format for path: " + path);
        }

        // Validate token and set authentication
        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(token, userId)) {
                    String role = jwtUtil.extractRole(token);
                    
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userId, 
                        null, 
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("✅ Authentication successful for user: " + userId + " with role: " + role);
                } else {
                    logger.warn("❌ Token validation failed for user: " + userId);
                }
            } catch (Exception e) {
                logger.error("❌ Error during token validation: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}

/* 

A JWTAuthenticationFilter is a custom filter in Spring Security that:

Intercepts every incoming HTTP request
Extracts the JWT token
Validates it
Authenticates the user
Sets security context

After that → the request continues to your controller.

Without this filter, your backend has no idea who the user is.

🧠 Big Picture Workflow

Here’s the real flow in a typical Spring Boot app:

Client → Login → Server generates JWT → Client stores token

Later:

Client → Sends request with JWT
        ↓
JWTAuthenticationFilter runs
        ↓
Token extracted & validated
        ↓
User authenticated
        ↓
Controller executes
🚀 Full JWT Workflow (Step-by-Step)
🔹 Step 1: User Login

User sends:

POST /login
{
  "username": "kalyan",
  "password": "1234"
}

Spring Security:

Authenticates using AuthenticationManager

If correct → generate JWT

Send token back

Example response:

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
🔹 Step 2: Client Sends Token in Header

Every protected request:

GET /orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Now JWTAuthenticationFilter enters the game.

🔥 What JWTAuthenticationFilter Actually Does

Let’s go step by step inside the filter.

1️⃣ Intercepts Request

It extends:

OncePerRequestFilter

So it runs once per request.

2️⃣ Extracts Authorization Header
String authHeader = request.getHeader("Authorization");

Checks:

if (authHeader != null && authHeader.startsWith("Bearer "))

Removes "Bearer ":

String token = authHeader.substring(7);
3️⃣ Validate Token

Uses JWT utility class:

String username = jwtService.extractUsername(token);

Then:

if (jwtService.isTokenValid(token, userDetails)) {

This checks:

Signature

Expiry

Tampering

Subject match

4️⃣ Load User Details
UserDetails userDetails = userDetailsService.loadUserByUsername(username);

Loads roles + authorities.

5️⃣ Create Authentication Object
UsernamePasswordAuthenticationToken authToken =
    new UsernamePasswordAuthenticationToken(
        userDetails,
        null,
        userDetails.getAuthorities()
    );
6️⃣ Set Security Context

This is the most important line:

SecurityContextHolder.getContext().setAuthentication(authToken);

🔥 This tells Spring:

“This request is authenticated. User = Kalyan. Role = USER.”

Now controllers can access:

@AuthenticationPrincipal
Principal principal
7️⃣ Continue Filter Chain
filterChain.doFilter(request, response);

Request now goes to controller.

🧩 Complete Flow Diagram
Incoming Request
        ↓
Security Filter Chain
        ↓
JWTAuthenticationFilter
        ↓
Extract Token
        ↓
Validate Token
        ↓
Load UserDetails
        ↓
Set Authentication in SecurityContext
        ↓
Controller Executes
🧠 Why Register Doesn’t Need JWT

You asked this earlier — now it makes sense:

Login → No JWT yet

Register → No JWT yet

Protected APIs → Need JWT

In SecurityConfig:

.authorizeHttpRequests(auth -> auth
    .requestMatchers("/login", "/register").permitAll()
    .anyRequest().authenticated()
)
🔥 Where Filter is Added

In SecurityConfig:

http.addFilterBefore(jwtAuthenticationFilter,
                     UsernamePasswordAuthenticationFilter.class);

Why before?

Because:

Default filter expects username/password

We want JWT to authenticate first */