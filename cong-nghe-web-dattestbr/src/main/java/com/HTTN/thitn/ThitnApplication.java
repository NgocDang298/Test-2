package com.HTTN.thitn;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({"com.HTTN.thitn", "com.HTTN.thitn.security"})
public class ThitnApplication {

	public static void main(String[] args) {
//		Dotenv.load();
		SpringApplication.run(ThitnApplication.class, args);
	}
}