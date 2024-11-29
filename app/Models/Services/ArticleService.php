<?php

namespace App\Models\Services;

use App\Models\Article;
use App\Models\Comment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;

class ArticleService
{
    public function listAllArticles(
        array $sorts = [],
        ?int $authorId = null,
        ?Carbon $createdSinceDate = null,
        ?string $search = null,
        ?string $tag = null,
    ): Builder {
        $query = Article::query()
            ->with(['author', 'tags']);

        if (empty($sorts)) {
            $query->latest();
        } else {
            foreach ($sorts as $sort) {
                if (is_string($sort)) {
                    $parts = explode(',', $sort);
                    if (count($parts) === 2) {
                        [$field, $direction] = $parts;
                        if (in_array($field, ['created_at', 'title'])) {
                            $direction = strtoupper($direction) === 'DESC' ? 'desc' : 'asc';
                            $query->orderBy($field, $direction);
                        }
                    }
                }
            }
        }

        if ($authorId) {
            $query->where('author_id', $authorId);
        }

        if ($createdSinceDate) {
            $query->where('created_at', '>=', $createdSinceDate);
        }

        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        if ($tag) {
            $query->whereHas('tags', function ($query) use ($tag) {
                $query->where('name', $tag);
            });
        }

        return $query;
    }

    public function store(
        string $title,
        string $content,
        User $author,
        ?string $coverUrl = null,
        ?Carbon $publicationDate = null,
    ): Article {
        $article = new Article;

        $article->title = $title;
        $article->content = $content;
        $article->author()->associate($author);
        $article->cover_url = $coverUrl;
        $article->publication_date = $publicationDate;

        $article->save();

        return $article;
    }

    public function findArticleById(int $articleId): ?Article
    {
        return Article::query()
            ->with('author')
            ->with('tags')
            ->where('id', $articleId)
            ->first();
    }

    public function getCommentsForArticle(Article $article, array $sorts = [])
    {
        $query = $article->comments();

        foreach ($sorts as $key => $direction) {
            $query = $query->orderBy($key, $direction);
        }

        return $query;
    }

    public function addComment(Article $article, string $commentContent, User $author)
    {
        $comment = new Comment;
        $comment->content = $commentContent;
        $comment->author()->associate($author);

        return $article->comments()->save($comment);
    }

    public function getTagsForArticle(Article $article, array $sorts = [])
    {
        $query = $article->tags();

        foreach ($sorts as $key => $direction) {
            $query = $query->orderBy($key, $direction);
        }

        return $query;
    }

    public function updateCoverPhoto(Article $article, $coverPhoto): void
    {
        // Delete old cover if exists
        if ($article->cover_url) {
            $this->deleteCoverPhoto($article);
        }

        // Store new cover
        $coverUrl = Storage::disk('public')->putFileAs(
            'covers',
            $coverPhoto,
            $article->id . '.' . $coverPhoto->getClientOriginalExtension()
        );

        $article->cover_url = Storage::url($coverUrl);
        $article->save();
    }

    public function deleteCoverPhoto(Article $article): void
    {
        if ($article->cover_url) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $article->cover_url));
            $article->cover_url = null;
            $article->save();
        }
    }
}
