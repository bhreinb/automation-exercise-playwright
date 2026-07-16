package com.example.playwright;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("smoke")
public class SmokeTest {

  @Test
  void smoke() {
    assertTrue(true);
  }
}
