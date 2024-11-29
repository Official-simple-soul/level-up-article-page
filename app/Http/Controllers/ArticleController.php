<?php

namespace App\Http\Controllers;

use App\Http\Requests\IndexArticleRequest;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use App\Models\Services\ArticleService;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Models\Tag;
use Illuminate\Support\Facades\File;
use App\Models\ArticleVersion;
use App\Commands\ArticleUpdateCommand;

class ArticleController
{
    private ArticleService $articleService;

    public function __construct(ArticleService $service)
    {
        $this->articleService = $service;
    }

    // list
    // showAllArticle
    public function index(IndexArticleRequest $request)
    {
        $page = (int) ($request->validated('page') ?? 1);
        $pageSize = (int) ($request->validated('perPage') ?? 5);
        $sorts = $request->validated('sort') ?? [];
        $authorId = $request->validated('filter.authorId');
        $createdSinceDate = $request->validated('filter.createdSinceDate')
            ? Carbon::parse($request->validated('filter.createdSinceDate'))
            : null;
        $search = $request->validated('search');
        $tag = $request->validated('tag');

        $query = $this->articleService->listAllArticles(
            $sorts,
            $authorId,
            $createdSinceDate,
            $search,
            $tag,
        );

        return $query
            ->paginate(perPage: $pageSize, page: $page)
            ->withQueryString();
    }

    // display
    // findById
    public function show(int $articleId)
    {
        // view layer (input) - does nothing

        // model layer - fetch article
        $article = $this->articleService->findArticleById($articleId);
        if (is_null($article)) {
            abort(404, 'Article not found');
        }

        // view layer (output) - does nothing, rely on automatic conversion to JSON
        return $article;
    }

    // getComments
    // articleComments
    public function comments(int $articleId, Request $request): Collection
    {
        // view layer (input)
        $page = (int) ($request->input('page') ?? 1);
        $pageSize = (int) ($request->input('perPage') ?? 5);
        $sorts = $request->input('sort') ?? [];

        // model layer - fetch article + fetch comments for that article
        $article = $this->articleService->findArticleById($articleId);
        if (is_null($article)) {
            abort(404, 'Article not found');
        }
        return $article->comments()->with('author')->get();
        // $query = $this->articleService->getCommentsForArticle($article, $sorts);

        // view layer (output) - paginate the results
        // return $query
        //     ->paginate(perPage: $pageSize, page: $page)
        //     ->withQueryString();
    }

    // create
    // saveArticle
    // persist
    // newArticle
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|min:3',
            'content' => 'required|min:10',
            'slug' => 'required|min:3',
            'publication_date' => 'required|date',
            'cover_url' => 'nullable|image|max:2048',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
        ]);

        // Format the date using Carbon
        $validated['publication_date'] = Carbon::parse($validated['publication_date'])->format('Y-m-d H:i:s');
        $validated['author_id'] = auth()->id();

        if ($request->hasFile('cover_url')) {
            $path = $request->file('cover_url')->store('articles', 'public');
            $validated['cover_url'] = $path;
        }

        
        $article = Article::create($validated);

        if (isset($validated['tags'])) {
            $article->tags()->sync($validated['tags']);
        }

        return response()->json($article, 201);
    }

    public function update(Request $request, Article $article)
    {
        if ($article->author_id !== auth()->id()) {
            abort(403, 'You can only edit your own articles');
        }

        $validated = $request->validate([
            'title' => 'required|min:3',
            'content' => 'required|min:10',
            'slug' => 'required|min:3',
            'publication_date' => 'required|date',
            'cover_url' => 'nullable|image|max:2048',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
        ]);

        $command = new ArticleUpdateCommand(
            $article,
            $validated['title'],
            $validated['content'],
            $validated['slug'],
            Carbon::parse($validated['publication_date']),
            $request->file('cover_url')
        );

        $article = $command->execute();

        if (isset($validated['tags'])) {
            $article->tags()->sync($validated['tags']);
        }

        return response()->json($article);
    }

    public function destroy(Article $article)
    {
        if ($article->author_id !== auth()->id()) {
            abort(403, 'You can only delete your own articles');
        }

        $article->delete();
        return response()->noContent();
    }

    public function attachTag(Article $article, Tag $tag)
    {
        if ($article->author_id !== auth()->id()) {
            abort(403, 'You can only tag your own articles');
        }

        $article->tags()->attach($tag);
        return $article->load('tags');
    }

    public function detachTag(Article $article, Tag $tag)
    {
        if ($article->author_id !== auth()->id()) {
            abort(403, 'You can only untag your own articles');
        }

        $article->tags()->detach($tag);
        return $article->load('tags');
    }

    public function storeComment(int $articleId, StoreCommentRequest $request)
    {
        $content = $request->validated('content');

        $article = $this->articleService->findArticleById($articleId);
        if (is_null($article)) {
            abort(404, 'Article not found');
        }

        $author = Auth::user();

        $comment = $this->articleService->addComment($article, $content, $author);

        return response()->json($comment, 201);
    }

    public function tags(Article $article, Request $request)
    {
        $page = (int) ($request->input('page') ?? 1);
        $pageSize = (int) ($request->input('perPage') ?? 5);
        $sorts = $request->input('sort') ?? [];

        $query = $this->articleService->getTagsForArticle($article, $sorts);

        return $query
            ->paginate(perPage: $pageSize, page: $page)
            ->withQueryString();
    }

    public function updateCover(Request $request, Article $article)
    {
        if ($article->author_id !== auth()->id()) {
            abort(403, 'You can only edit your own articles');
        }

        $request->validate([
            'cover' => ['required', File::image()->max('10mb')],
        ]);

        $this->articleService->updateCoverPhoto($article, $request->file('cover'));

        return $article->fresh();
    }

    public function deleteCover(Article $article)
    {
        if ($article->author_id !== auth()->id()) {
            abort(403, 'You can only edit your own articles');
        }

        $this->articleService->deleteCoverPhoto($article);

        return $article->fresh();
    }

    public function versions(Article $article)
    {
        return $article->versions()
            ->orderBy('created_at', 'desc')
            ->paginate();
    }

    public function restore(Article $article, ArticleVersion $version)
    {
        if ($article->author_id !== auth()->id()) {
            abort(403, 'You can only restore versions of your own articles');
        }

        if ($version->article_id !== $article->id) {
            abort(400, 'Version does not belong to this article');
        }

        $command = new ArticleUpdateCommand(
            $article,
            $version->title,
            $version->content,
            $version->slug,
            Carbon::parse($version->publication_date)
        );

        $article = $command->execute();

        return response()->json($article);
    }
}
