<?php

namespace App\Commands;

use App\Models\Article;
use App\Models\ArticleVersion;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ArticleUpdateCommand
{
    public function __construct(
        private Article $article,
        private string $title,
        private string $content,
        private string $slug,
        private Carbon $publicationDate,
        private ?UploadedFile $coverImage = null
    ) {}

    public function execute(): Article
    {
        ArticleVersion::create([
            'article_id' => $this->article->id,
            'title' => $this->article->title,
            'content' => $this->article->content,
            'slug' => $this->article->slug,
            'publication_date' => $this->article->publication_date,
            'cover_url' => $this->article->cover_url,
        ]);

        $this->article->update([
            'title' => $this->title,
            'content' => $this->content,
            'slug' => $this->slug,
            'publication_date' => $this->publicationDate,
        ]);

        if ($this->coverImage) {
            try {
                if ($this->article->cover_url) {
                    Storage::disk('public')->delete($this->article->cover_url);
                }
                
                $path = $this->coverImage->store('articles', 'public');
                
                if (!$path) {
                    throw new \Exception('Failed to store the image');
                }

                $this->article->update(['cover_url' => $path]);
            } catch (\Exception $e) {
                \Log::error('Failed to handle cover image: ' . $e->getMessage());
                throw $e;
            }
        }

        return $this->article;
    }
} 