package com.recruitment.service;

import com.recruitment.dto.request.LoginRequest;
import com.recruitment.dto.request.RegisterRequest;
import com.recruitment.dto.response.AuthResponse;
import com.recruitment.entity.CandidateProfile;
import com.recruitment.entity.Company;
import com.recruitment.entity.Role;
import com.recruitment.entity.User;
import com.recruitment.repository.CandidateProfileRepository;
import com.recruitment.repository.CompanyRepository;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.JwtUtils;
import com.recruitment.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .email(userDetails.getUsername())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .build();
    }

    @Transactional
    public void registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Role role;
        try {
            role = Role.valueOf(signUpRequest.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error: Role is not valid.");
        }

        // Create new user's account
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .fullName(signUpRequest.getFullName())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(role)
                .build();

        user = userRepository.save(user);

        // Create associated profile based on role
        if (role == Role.EMPLOYER) {
            Company company = Company.builder()
                    .user(user)
                    .name(user.getFullName() + "'s Company") // Default name
                    .build();
            companyRepository.save(company);
        } else if (role == Role.CANDIDATE) {
            CandidateProfile profile = CandidateProfile.builder()
                    .user(user)
                    .title("New Candidate") // Default title
                    .build();
            candidateProfileRepository.save(profile);
        }
    }
}
