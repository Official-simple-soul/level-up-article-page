<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'title' => $this->resource->title,
            'content' => $this->resource->content,
            'author_id' => $this->resource->author_id,
            'author' => $this->whenLoaded('author'),
            'created_at' => $this->resource->created_at,
            'updated_at' => $this->resource->updated_at,
            'cover_url' => $this->cover_url ? asset($this->cover_url) : null,
        ];
    }
}
