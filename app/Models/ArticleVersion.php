<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleVersion extends Model
{
    protected $fillable = [
        'article_id',
        'title',
        'content',
        'slug',
        'publication_date',
        'cover_url',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
} 