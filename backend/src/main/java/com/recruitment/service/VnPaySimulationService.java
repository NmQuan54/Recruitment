package com.recruitment.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class VnPaySimulationService {

    @Value("${MOCK-VNPAY.SIMULATOR-URL}")
    private String simulatorUrl;

    public String createMockPaymentUrl(long amount, String orderInfo, String txnRef) {
        try {
            // Simply generate a URL to our frontend simulator with parameters
            return simulatorUrl + "?amount=" + amount + 
                   "&orderInfo=" + URLEncoder.encode(orderInfo, StandardCharsets.UTF_8.toString()) + 
                   "&txnRef=" + txnRef;
        } catch (Exception e) {
            return simulatorUrl + "?amount=" + amount + "&status=error";
        }
    }
}
