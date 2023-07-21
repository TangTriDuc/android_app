package com.example.ecommerceapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.ecommerceapp.R;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;

import java.util.Objects;

public class LoginActivity extends AppCompatActivity {

    EditText email, password;
    FirebaseAuth firebaseAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        //Ẩn action bar
        Objects.requireNonNull(getSupportActionBar()).hide();

        email = findViewById(R.id.email);
        password = findViewById(R.id.password);

        //Add auth cho Firebase
        firebaseAuth = FirebaseAuth.getInstance();

    }

    public void signin(View view) {
        String userEmail = email.getText().toString();
        String userPassword = password.getText().toString();

        //Ktra chuỗi bên trong Email có trống ko (ktra null bên trong)
        if (TextUtils.isEmpty(userEmail)) {
            Toast.makeText(this, "Enter Email !!", Toast.LENGTH_SHORT).show();
            return;
        }

        //Ktra chuỗi bên trong password có trống ko (ktra null bên trong)
        if (TextUtils.isEmpty(userPassword)) {
            Toast.makeText(this, "Enter Password !!", Toast.LENGTH_SHORT).show();
            return;
        }
        //Ktra Password có điền đủ 6 ký tự ko
        if (userPassword.length() < 6) {
            Toast.makeText(this, "Password too short, enter minimum 6 characters", Toast.LENGTH_SHORT).show();
            return;
        }

        //Xly để đăng nhập vào Firebase
        firebaseAuth.signInWithEmailAndPassword(userEmail, userPassword)
                        .addOnCompleteListener(LoginActivity.this, new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {

                                if (task.isSuccessful()) {
                                    Toast.makeText(LoginActivity.this, "Login Successful", Toast.LENGTH_SHORT).show();
                                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
                                }

                                else {
                                    Toast.makeText(LoginActivity.this, "Error:" + task.getException(), Toast.LENGTH_SHORT).show();
                                }
                            }
                        });

    }

    public void signup(View view) {
        startActivity(new Intent(LoginActivity.this, RegistrationActivity.class));
    }
}