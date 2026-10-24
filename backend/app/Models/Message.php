<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversaion_id',
        'sender_id',
        'body',
    ];
    
    public function User(){
        return $this->belongsTo(User::class, "sender_id");
    }
}
