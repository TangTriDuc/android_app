//Làm giỏ hàng
package com.example.ecommerceapp.activities;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.bumptech.glide.Glide;
import com.example.ecommerceapp.R;
import com.example.ecommerceapp.models.NewProductsModel;
import com.example.ecommerceapp.models.PopularProductsModel;
import com.example.ecommerceapp.models.ShowAllModel;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;

public class DetailedActivity extends AppCompatActivity {

    ImageView detailedImg;
    TextView rating, name, description, price, quantity;
    Button addToCart, buyNow;
    ImageView addItems, removeItems;

    //Xly Toolbar
    Toolbar toolbar;

    //Function add or remove quantity(SL sp)
    int totalQuantity = 1;
    int totalPrice = 0;

    //New Products with Recyclerview
    NewProductsModel newProductsModel = null;

    //Popular Product with Recyclerview
    PopularProductsModel popularProductsModel = null;

    //Show All Product when click product in product see all
    ShowAllModel showAllModel = null;

    FirebaseAuth auth;
    FirebaseFirestore firestore;

    @SuppressWarnings({"Convert2Lambda", "ConstantConditions"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_detailed);

//        /*//hide status bar with color pink
//        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);*/

        //Xly Toolbar
        toolbar = findViewById(R.id.detailed_toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        //Xly back cho toolbar
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        //Xly login + register + firestore
        firestore = FirebaseFirestore.getInstance();
        auth = FirebaseAuth.getInstance();

        //Base on NewProductsAdapter.java trong onBindViewHolder
        final Object obj = getIntent().getSerializableExtra("detailed");

        //instanceof để kiểm tra một đối tượng có phải là thể hiển của một kiểu dữ liệu cụ thể không (lớp, lớp con, interface).
        if (obj instanceof NewProductsModel){
            newProductsModel = (NewProductsModel) obj;
        } else if (obj instanceof PopularProductsModel) {
            popularProductsModel = (PopularProductsModel) obj;
        }else if (obj instanceof ShowAllModel) {
            showAllModel = (ShowAllModel) obj;
        }

        detailedImg = findViewById(R.id.detailed_img);
        quantity = findViewById(R.id.quantity);
        name = findViewById(R.id.detailed_name);
        rating = findViewById(R.id.rating);
        description = findViewById(R.id.detail_desc);
        price = findViewById(R.id.detail_price);

        addToCart = findViewById(R.id.add_to_cart);
        buyNow = findViewById(R.id.buy_now);

        addItems = findViewById(R.id.add_item);
        removeItems = findViewById(R.id.remove_item);

        //Xly để add picture vào giỏ hàng
        //New Products
        if (newProductsModel != null){
            Glide.with(getApplicationContext()).load(newProductsModel.getImg_url()).into(detailedImg);
            name.setText(newProductsModel.getName());
            rating.setText(newProductsModel.getRating());
            description.setText(newProductsModel.getDescription());
            price.setText(String.valueOf(newProductsModel.getPrice()));
            name.setText(newProductsModel.getName());

            //Function add or remove quantity(SL sp + price tăng theo )
            totalPrice = newProductsModel.getPrice() * totalQuantity;

        }

        //Popular Product with Recyclerview
        if (popularProductsModel != null){
            Glide.with(getApplicationContext()).load(popularProductsModel.getImg_url()).into(detailedImg);
            name.setText(popularProductsModel.getName());
            rating.setText(popularProductsModel.getRating());
            description.setText(popularProductsModel.getDescription());
            price.setText(String.valueOf(popularProductsModel.getPrice()));
            name.setText(popularProductsModel.getName());

            //Function add or remove quantity(SL sp + price tăng theo )
            totalPrice = popularProductsModel.getPrice() * totalQuantity;

        }

        //ShowAll Product with Recyclerview
        if (showAllModel != null){
            Glide.with(getApplicationContext()).load(showAllModel.getImg_url()).into(detailedImg);
            name.setText(showAllModel.getName());
            rating.setText(showAllModel.getRating());
            description.setText(showAllModel.getDescription());
            price.setText(String.valueOf(showAllModel.getPrice()));
            name.setText(showAllModel.getName());

            //Function add or remove quantity(SL sp + price tăng theo )
            totalPrice = showAllModel.getPrice() * totalQuantity;
        }

        //Buy Now with Post User Address(Add Address)
        buyNow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Xly chưa có payment detail
                //startActivity(new Intent(DetailedActivity.this, AddressActivity.class));

                //Xly khi có function payment detail
                Intent intent = new Intent(DetailedActivity.this, AddressActivity.class);

                if(newProductsModel != null) {
                    intent.putExtra("item", newProductsModel);
                }
                if (popularProductsModel != null) {
                    intent.putExtra("item", popularProductsModel);
                }
                if (showAllModel != null) {
                    intent.putExtra("item", showAllModel);
                }
                startActivity(intent);
            }
        });

        //Make function add to cart
        addToCart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                addToCart();
            }
        });

        //Function add or remove quantity(SL sp)
        addItems.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(totalQuantity < 10) {
                    totalQuantity++;
                    quantity.setText(String.valueOf(totalQuantity));
                }


                //Function add or remove quantity(SL sp + price tăng theo )
                if (newProductsModel != null){
                    totalPrice = newProductsModel.getPrice() * totalQuantity;
                }

                //Function add or remove quantity(SL sp + price tăng theo )
                if (popularProductsModel != null){
                    totalPrice = popularProductsModel.getPrice() * totalQuantity;
                }

                //Function add or remove quantity(SL sp + price tăng theo )
                if (showAllModel != null){
                    totalPrice = showAllModel.getPrice() * totalQuantity;
                }



            }
        });

        removeItems.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if(totalQuantity > 1) {
                    totalQuantity--;
                    quantity.setText(String.valueOf(totalQuantity));
                }

            }
        });

    }

    //Function to add / remove product
    @SuppressWarnings({"unused", "MismatchedQueryAndUpdateOfCollection", "UnusedAssignment", "RedundantSuppression", "Convert2Lambda"})
    private void addToCart() {
        String saveCurrentTime, saveCurrentDate;

        Calendar calForDate = Calendar.getInstance();

        @SuppressLint("SimpleDateFormat") SimpleDateFormat currentDate = new SimpleDateFormat("MM dd, yyy");
        saveCurrentDate = currentDate.format(calForDate.getTime());

        @SuppressLint("SimpleDateFormat") SimpleDateFormat currentTime = new SimpleDateFormat("HH:mm:ss a");
        saveCurrentTime = currentTime.format(calForDate.getTime());

        final HashMap<String, Object> cartMap  = new HashMap<>();

        cartMap.put("productName", name.getText().toString());
        //noinspection OverwrittenKey
        cartMap.put("productPrice", price.getText().toString());
        //noinspection OverwrittenKey
        cartMap.put("currentTime", saveCurrentTime);
        cartMap.put("currentDate", saveCurrentDate);

        //Function add or remove quantity(SL sp + price tăng theo )
        cartMap.put("totalQuantity", quantity.getText().toString());
        cartMap.put("totalPrice", totalPrice);


        //XLy khi bấm vào giỏ hàng thì sẽ thêm sp vào firestore
        //noinspection ConstantConditions
        firestore.collection("AddToCart").document(auth.getCurrentUser().getUid())
                .collection("User")
                .add(cartMap)
                .addOnCompleteListener(new OnCompleteListener<DocumentReference>() {
                    @Override
                    public void onComplete(@NonNull Task<DocumentReference> task) {
                        Toast.makeText(DetailedActivity.this, "Added To A Cart", Toast.LENGTH_SHORT).show();
                        finish();
                    }
                });

    }
}