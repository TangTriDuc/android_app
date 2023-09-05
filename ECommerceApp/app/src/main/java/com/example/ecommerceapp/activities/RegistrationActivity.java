package com.example.ecommerceapp.activities;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.MotionEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.ecommerceapp.R;
import com.google.firebase.auth.FirebaseAuth;

public class RegistrationActivity extends AppCompatActivity {

    EditText name, email, registerpassword;
    FirebaseAuth firebaseAuth;

    SharedPreferences sharedPreferences;

    //xly show/hide pass
    boolean passwordVisible;

    /** @noinspection Convert2Lambda*/
    @SuppressLint({"ApplySharedPref", "ClickableViewAccessibility"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registration);

//        /*//Ẩn action bar
//        Objects.requireNonNull(getSupportActionBar()).hide();*/

        name = findViewById(R.id.name);
        email = findViewById(R.id.email);
        registerpassword = findViewById(R.id.password);

        //Add auth cho Firebase
        firebaseAuth = FirebaseAuth.getInstance();
        if (firebaseAuth.getCurrentUser() != null){
            startActivity(new Intent(RegistrationActivity.this, MainActivity.class));
            finish();
        }

        sharedPreferences = getSharedPreferences("onBoardingScreen", MODE_PRIVATE);
        boolean isFirstTime = sharedPreferences.getBoolean("firstTime", true);
        if (isFirstTime){
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putBoolean("firstTime", false);
            editor.commit();

            Intent intent = new Intent(RegistrationActivity.this, OnBoardingActivity.class);
            startActivity(intent);
            finish();
        }


        //Xly show or hide password
        registerpassword.setOnTouchListener(new View.OnTouchListener() {
            @SuppressLint("ClickableViewAccessibility")
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                final int Right = 2;

                if (event.getAction() == MotionEvent.ACTION_UP) {
                    // Adjust this value as needed
                    final int DRAWABLE_CLICK_PADDING = 16;
                    if (event.getRawX() >= registerpassword.getRight() - registerpassword.getCompoundDrawables()[Right].getBounds().width() - DRAWABLE_CLICK_PADDING) {
                        int selection = registerpassword.getSelectionEnd();
                        if (passwordVisible) {
                            //Thiết lập drawable ảnh
                            registerpassword.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.baseline_visibility_off_24, 0);

                            //Hide password
                            registerpassword.setTransformationMethod(PasswordTransformationMethod.getInstance());
                            passwordVisible = false;
                        } else {
                            //Thiết lập drawable ảnh
                            registerpassword.setCompoundDrawablesWithIntrinsicBounds(0, 0, R.drawable.baseline_visibility_24, 0);

                            //Show password
                            registerpassword.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                            passwordVisible = true;
                        }
                        registerpassword.setSelection(selection);
                        return true;
                    }
                }
                return false;
            }
        });


    }

    public void signup(View view) {

        String userName = name.getText().toString();
        String userEmail = email.getText().toString();
        String userPassword = registerpassword.getText().toString();

        //Ktra chuỗi bên trong Name có trống ko (ktra null bên trong)
        if (TextUtils.isEmpty(userName)) {
            Toast.makeText(this, "Enter Name !!", Toast.LENGTH_SHORT).show();
            return;

        }

        //Ktra chuỗi bên trong Email có trống ko (ktra null bên trong)
        if (TextUtils.isEmpty(userEmail)) {
            Toast.makeText(this, "Enter Email !!", Toast.LENGTH_SHORT).show();
            return;
        }

        //Ktra chuỗi bên trong password có trống ko (ktra null bên trong)
      /*//  if (TextUtils.isEmpty(userPassword)) {
            Toast.makeText(this, "Enter Password !!", Toast.LENGTH_SHORT).show();
            return;
        }//*/

        if (!isPasswordValid(userPassword)) {
            Toast.makeText(RegistrationActivity.this, "Password must contain both letters and numbers", Toast.LENGTH_SHORT).show();
            return;
        }

        //Ktra Password có điền đủ 6 ký tự ko
        if (userPassword.length() < 6) {
            Toast.makeText(this, "Password too short, enter minimum 6 characters", Toast.LENGTH_SHORT).show();
            return;
        }

        //Xly register vs Firebase auth cho Email&Password
        firebaseAuth.createUserWithEmailAndPassword(userEmail, userPassword)
                .addOnCompleteListener(RegistrationActivity.this, task -> {

                    //Xly task(Email & Password)
                    if (task.isSuccessful()) {
                        Toast.makeText(RegistrationActivity.this, "Successfully Register", Toast.LENGTH_SHORT).show();
                        startActivity(new Intent(RegistrationActivity.this, MainActivity.class));
                    }
                    else {
                        Toast.makeText(RegistrationActivity.this, "Registration is not Successfully !!!" + task.getException(), Toast.LENGTH_SHORT).show();
                    }
                });
    }

    //Xly khi bấm vào chữ Sign In
    public void signin(View view) {
        startActivity(new Intent(RegistrationActivity.this, LoginActivity.class));

    }


    // Function to check if the password contains both letters and numbers
    private boolean isPasswordValid(String password) {
        boolean hasLetter = false;
        boolean hasNumber = false;

        for (int i = 0; i < password.length(); i++) {
            char c = password.charAt(i);
            if (Character.isLetter(c)) {
                hasLetter = true;
            } else if (Character.isDigit(c)) {
                hasNumber = true;
            }

            if (hasLetter && hasNumber) {
                return true;
            }
        }

        return false;
    }


}