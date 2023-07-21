package com.example.ecommerceapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.text.HtmlCompat;
import androidx.viewpager.widget.ViewPager;

import com.example.ecommerceapp.R;
import com.example.ecommerceapp.adapters.SliderAdapter;

public class OnBoardingActivity extends AppCompatActivity {

    ViewPager viewPager;
    LinearLayout dotsLayout;

    //Xly khi bấm chuyển tới trang cuối thì nó hiện
    Button btn;

    SliderAdapter sliderAdapter;

    //Make appear dot
    TextView[] dots;

    //Xly thời gian ảnh động lặp lại xuất hiện cho Let's Get Started
    Animation animation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_on_boarding);

//       /* //hide status bar with color pink
//        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
//
//        //Hide toolbar with color Blue
//        Objects.requireNonNull(getSupportActionBar()).hide();*/

        viewPager = findViewById(R.id.slider);
        dotsLayout = findViewById(R.id.dots);
        //Xly khi bấm chuyển tới trang cuối thì nó hiện
        btn = findViewById(R.id.get_started_btn);
        //Make appear dot
        addDots(0);

        //Xly khi bấm chuyển tới trang cuối thì nó hiện
        viewPager.addOnPageChangeListener(changeListener);

        //Call Adapter
        sliderAdapter = new SliderAdapter(this);
        viewPager.setAdapter(sliderAdapter);
        btn.setOnClickListener(view -> {
            startActivity(new Intent(OnBoardingActivity.this, RegistrationActivity.class));
            finish();
        });

    }

    //Make appear dot
    private void addDots(int position){

        dots = new TextView[3];
        dotsLayout.removeAllViews();
        for (int i = 0; i < dots.length; i++) {
            dots[i] = new TextView(this);
//            dots[i].setText(Html.fromHtml("&#8226;"));
            dots[i].setText(HtmlCompat.fromHtml("&#8226;", HtmlCompat.FROM_HTML_MODE_LEGACY));
            dots[i].setTextSize(35);
            dotsLayout.addView(dots[i]);
        }

        if (dots.length > 0) {
//            dots[position].setTextColor(getResources().getColor(R.color.pink));
            dots[position].setTextColor(ContextCompat.getColor(this, R.color.pink));
        }
    }

    //Xly khi quẹt qua thì dấu chấm chuyển theo + //Process to appear slow for Lets get started
    ViewPager.OnPageChangeListener changeListener = new ViewPager.OnPageChangeListener() {
        @Override
        public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

        }

        //Xly khi bấm chuyển tới trang cuối thì nó hiện
        @Override
        public void onPageSelected(int position) {

            addDots(position);

            if (position == 0) {
                btn.setVisibility(View.INVISIBLE);
            }else if (position == 1){
                btn.setVisibility(View.INVISIBLE);
            }else {
                //Xly thời gian ảnh động lặp lại xuất hiện cho Let's Get Started
                animation = AnimationUtils.loadAnimation(OnBoardingActivity.this,R.anim.slide_animation);
                btn.setAnimation(animation);
                //Xly khi quẹt qua thì dấu chấm chuyển theo
                btn.setVisibility(View.VISIBLE);
            }

        }

        @Override
        public void onPageScrollStateChanged(int state) {

        }
    };

}