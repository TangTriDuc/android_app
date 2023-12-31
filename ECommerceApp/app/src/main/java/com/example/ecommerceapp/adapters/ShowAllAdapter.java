package com.example.ecommerceapp.adapters;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.ecommerceapp.R;
import com.example.ecommerceapp.activities.DetailedActivity;
import com.example.ecommerceapp.models.ShowAllModel;

import java.util.List;

public class ShowAllAdapter extends RecyclerView.Adapter<ShowAllAdapter.ViewHolder> {

    private final Context context;
    private final List<ShowAllModel> list;

    public ShowAllAdapter(Context context, List<ShowAllModel> list) {
        this.context = context;
        this.list = list;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.show_all_item, parent, false));
    }

    @SuppressWarnings("Convert2Lambda")
    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        //Xly Glide để load ảnh
        Glide.with(context).load(list.get(position).getImg_url()).into(holder.mItemImage);

        //Thêm String.valueOf vì price trong Firebase cloud gtri là number
        holder.mCost.setText("$" + list.get(position).getPrice());

        //RecycleView OnClickListener (see all)
        holder.mName.setText(list.get(position).getName());

        //Xly khi bấm vào sp trong see all thì đưa tới cart
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int clickedPosition = holder.getAdapterPosition();
                Intent intent = new Intent(context, DetailedActivity.class);
                intent.putExtra("detailed",list.get(clickedPosition));
                context.startActivity(intent);
            }
        });


    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        ImageView mItemImage;
        TextView mCost;
        TextView mName;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);

            mItemImage = itemView.findViewById(R.id.item_image);
            mCost = itemView.findViewById(R.id.item_cost);
            mName = itemView.findViewById(R.id.item_nam);
        }
    }
}
