package com.example.ecommerceapp.activities;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.MotionEvent;
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

public class LoginActivity extends AppCompatActivity {

    EditText email, password;
    FirebaseAuth firebaseAuth;

    //Make show/hide password
    boolean passwordVisible;

    /** @noinspection Convert2Lambda*/
    @SuppressLint("ClickableViewAccessibility")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

//        /*//Ẩn action bar
//        Objects.requireNonNull(getSupportActionBar()).hide();*/

        email = findViewById(R.id.email);
        password = findViewById(R.id.password);

        //Add auth cho Firebase
        firebaseAuth = FirebaseAuth.getInstance();

        //Xly show or hide password
        password.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                final int Right = 2;

                if (event.getAction() == MotionEvent.ACTION_UP) {
                    // Adjust this value as needed
                    final int DRAWABLE_CLICK_PADDING = 16;
                    if (event.getRawX() >= password.getRight() - password.getCompoundDrawables()[Right].getBounds().width() - DRAWABLE_CLICK_PADDING) {
                        int selection = password.getSelectionEnd();
                        if (passwordVisible) {
                            //Thiết lập drawable ảnh
                            password.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.baseline_login_visibility_off_24, 0);

                            //Hide password
                            password.setTransformationMethod(PasswordTransformationMethod.getInstance());
                            passwordVisible = false;
                        } else {
                            //Thiết lập drawable ảnh
                            password.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.baseline_login_visibility_24, 0);

                            //Show password
                            password.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                            passwordVisible = true;
                        }
                        password.setSelection(selection);
                        return true;
                    }
                }
                return false;
            }
        });

    }

    /** @noinspection Convert2Lambda*/
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