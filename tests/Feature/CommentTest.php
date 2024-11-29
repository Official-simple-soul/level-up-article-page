<?php

namespace Tests\Feature;

use App\Models\Article;
use Database\Factories\UserFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    public function test_comment_creation(): void
    {
        // given: a user on our app and an article
        $user = UserFactory::new()->set('name', 'test user')->createOne();
        $article = Article::factory()->createOne();
        $testContent = 'test content';

        // when: creating a new article as that user
        $response = $this
            ->actingAs($user)
            ->postJson(
                "/api/articles/$article->id/comments",
                [
                    'content' => $testContent,
                ]
            );

        // then: assert that comment was created by correct user
        $response->assertStatus(201);
        $this->assertDatabaseHas(
            'comments',
            [
                'content' => $testContent,
                'author_id' => $user->id,
                'article_id' => $article->id,
            ]
        );
    }
}
