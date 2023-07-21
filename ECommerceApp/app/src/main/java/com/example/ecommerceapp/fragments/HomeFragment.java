//Use ImageSlider

package com.example.ecommerceapp.fragments;

import android.annotation.SuppressLint;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.denzcoskun.imageslider.ImageSlider;
import com.denzcoskun.imageslider.constants.ScaleTypes;
import com.denzcoskun.imageslider.models.SlideModel;
import com.example.ecommerceapp.R;
import com.example.ecommerceapp.activities.ShowAllActivity;
import com.example.ecommerceapp.adapters.CategoryAdapter;
import com.example.ecommerceapp.adapters.NewProductsAdapter;
import com.example.ecommerceapp.adapters.PopularProductsAdapter;
import com.example.ecommerceapp.models.CategoryModel;
import com.example.ecommerceapp.models.NewProductsModel;
import com.example.ecommerceapp.models.PopularProductsModel;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;

import java.util.ArrayList;
import java.util.List;

public class HomeFragment extends Fragment {

    //Xly show all product
    TextView catShowAll, popularShowAll, newProductShowAll;

    LinearLayout linearLayout;
    //Xly Process Bar
    ProgressDialog progressDialog;

    /*Xly cho recyclerView with Glide*/
    RecyclerView catRecyclerview, newProductRecyclerview, popularRecyclerview;
    //Category recycleview
    CategoryAdapter categoryAdapter;
    List<CategoryModel> categoryModelList;

    //New Product Recyclerview
    NewProductsAdapter newProductsAdapter;
    List<NewProductsModel> newProductsModelList;

    //Popular Product with Recyclerview
    PopularProductsAdapter popularProductsAdapter;
    List<PopularProductsModel> popularProductsModelList;

    //Initialize Cloud Firestore
    FirebaseFirestore db;

    public HomeFragment() {
        // Required empty public constructor
    }


    @SuppressWarnings("Convert2Lambda")
    @SuppressLint("NotifyDataSetChanged")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View root =  inflater.inflate(R.layout.fragment_home, container, false);


        //Initialize Cloud Firestore
        db = FirebaseFirestore.getInstance();

        //Xly Process Bar
        //noinspection deprecation
        progressDialog = new ProgressDialog(getActivity());

        /*Xly cho recyclerView with Glide*/
        catRecyclerview = root.findViewById(R.id.rec_category);

        //New Product with Recyclerview
        newProductRecyclerview = root.findViewById(R.id.new_product_rec);

        //New Popular Product with Recyclerview
        popularRecyclerview = root.findViewById(R.id.popular_rec);

        //Xly show all product
        catShowAll = root.findViewById(R.id.category_see_all);
        popularShowAll = root.findViewById(R.id.popular_see_all);
        newProductShowAll = root.findViewById(R.id.newProducts_see_all);

        //Xly click see all product cho category
        catShowAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getContext(), ShowAllActivity.class);
                startActivity(intent);
            }
        });

        //Xly click see all product cho New Products
        newProductShowAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getContext(), ShowAllActivity.class);
                startActivity(intent);
            }
        });

        //Xly click see all product cho Popular Products
        popularShowAll.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getContext(), ShowAllActivity.class);
                startActivity(intent);
            }
        });

        //Xly Process Bar
        linearLayout = root.findViewById(R.id.home_layout);
        linearLayout.setVisibility(View.GONE);

        //Image slider
        ImageSlider imageSlider = root.findViewById(R.id.image_slider);
        List<SlideModel> slideModels = new ArrayList<>();

        slideModels.add(new SlideModel(R.drawable.banner1, "Discount On Shoes Items", ScaleTypes.CENTER_CROP));
        slideModels.add(new SlideModel(R.drawable.banner2, "Discount On Perfume", ScaleTypes.CENTER_CROP));
        slideModels.add(new SlideModel(R.drawable.banner3, "70% OFF", ScaleTypes.CENTER_CROP));

        imageSlider.setImageList(slideModels);

        //Xly Process Bar
        progressDialog.setTitle("Welcome to My ECommerce App");
        //noinspection deprecation
        progressDialog.setMessage("Loading....");
        progressDialog.setCanceledOnTouchOutside(false);
        progressDialog.show();

        //Category
        /*Xly cho recyclerView Category with Glide*/
        catRecyclerview.setLayoutManager(new LinearLayoutManager(getActivity(), RecyclerView.HORIZONTAL,false));
        categoryModelList = new ArrayList<>();
        categoryAdapter = new CategoryAdapter(getContext(),categoryModelList);
        catRecyclerview.setAdapter(categoryAdapter);

        /*Lấy từ huong dan trong tools Firebase Cloud Firestore*/
        //Read data from Firebase Cloud
        db.collection("Category")
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        for (QueryDocumentSnapshot document : task.getResult()) {

                            CategoryModel categoryModel = document.toObject(CategoryModel.class);
                            categoryModelList.add(categoryModel);
                            categoryAdapter.notifyDataSetChanged();
                            linearLayout.setVisibility(View.VISIBLE);

                            //Xly Process Bar
                            progressDialog.dismiss();

                        }
                    } else {
                        Toast.makeText(getActivity(), "" + task.getException(), Toast.LENGTH_SHORT).show();
                    }

                });

        //New Product Recyclerview
        newProductRecyclerview.setLayoutManager(new LinearLayoutManager(getActivity(),RecyclerView.HORIZONTAL, false));
        newProductsModelList = new ArrayList<>();
        newProductsAdapter = new NewProductsAdapter(getContext(), newProductsModelList);
        newProductRecyclerview.setAdapter(newProductsAdapter);

        //Lấy từ huong dan trong tools Firebase Cloud Firestore
        //Read data from Firebase Cloud with NewProducts
        db.collection("NewProducts")
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            NewProductsModel newProductsModel = document.toObject(NewProductsModel.class);
                            newProductsModelList.add(newProductsModel);
                            newProductsAdapter.notifyDataSetChanged();


                        }
                    } else {
                        Toast.makeText(getActivity(), "" + task.getException(), Toast.LENGTH_SHORT).show();
                    }
                });

        //Popular Product with Recyclerview
        //xly hiện 2 ảnh trong 1 slide
        popularRecyclerview.setLayoutManager(new GridLayoutManager(getActivity(),2));
        popularProductsModelList = new ArrayList<>();
        popularProductsAdapter = new PopularProductsAdapter(getContext(),popularProductsModelList);
        popularRecyclerview.setAdapter(popularProductsAdapter);

        //Lấy từ huong dan trong tools Firebase Cloud Firestore
        //Read data from Firebase Cloud with Popular Products
        db.collection("AllProducts")
                .get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        for (QueryDocumentSnapshot document : task.getResult()) {
                            PopularProductsModel popularProductsModel = document.toObject(PopularProductsModel.class);
                            popularProductsModelList.add(popularProductsModel);
                            popularProductsAdapter.notifyDataSetChanged();


                        }
                    } else {
                        Toast.makeText(getActivity(), "" + task.getException(), Toast.LENGTH_SHORT).show();
                    }
                });

        return  root;
    }
}