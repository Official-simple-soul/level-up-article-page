<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Services\BannedTopicsDetectorInterface;
use Database\Factories\UserFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    public function test_article_creation(): void
    {
        // given: a user on our app
        $user = UserFactory::new()
            ->set('name', 'test user')
            ->createOne();

        // when: creating a new article as that user
        $response = $this
            ->actingAs($user)
            ->postJson(
                '/api/articles',
                [
                    'title' => 'test title',
                    'content' => 'test content',
                ]
            );

        // then: assert that article was created by correct user
        $response->assertStatus(201);
        $this->assertDatabaseHas('articles', [
            'title' => 'test title',
            'content' => 'test content',
            'author_id' => $user->id,
        ]);
    }

    public function test_cannot_change_article_authored_by_someone_else(): void
    {
        // given: two users and an article created by first user
        $user1 = UserFactory::new()->createOne();
        $user2 = UserFactory::new()->createOne();
        $articleFromUser1 = Article::factory()
            ->set('title', 'test title')
            ->set('content', 'test content')
            ->for($user1, 'author')
            ->createOne();

        // when: trying to edit article from another user
        $response = $this
            ->actingAs($user2)
            ->putJson(
                '/api/articles/' . $articleFromUser1->id,
                [
                    'title' => 'changed title',
                    'content' => 'changed content',
                ]
            );

        // then: assert that action is forbidden
        $response->assertForbidden();
        $this->assertDatabaseHas(
            'articles',
            [
                'title' => 'test title',
                'content' => 'test content',
                'author_id' => $user1->id,
            ]
        );
    }

    public function test_unauthenticated_user_cannot_post_articles(): void
    {
        // given: nothing

        // when: trying to post article as unauthenticated user
        $response = $this
            ->postJson(
                '/api/articles/',
                [
                    'title' => 'new title',
                    'content' => 'new content',
                ]
            );

        // then: assert that action is forbidden because used is not authorized
        $response->assertUnauthorized();
        $this->assertDatabaseCount('articles', 0);
    }


    /**
     * This test verifies the logic about banned articles.
     * It does not care how the banned topics are detected.
     *
     * But it cares that an appropriate error is returned and that no article is created.
     */
    public function test_article_censorship_about_certain_topics(): void
    {
        // given: a user on our app
        $user = UserFactory::new()
            ->set('name', 'test user')
            ->createOne();

        $this->instance(
            BannedTopicsDetectorInterface::class,
            Mockery::mock(
                BannedTopicsDetectorInterface::class,
                function (MockInterface $mock) {
                    return $mock
                        ->shouldReceive('isAllowed')
                        ->andReturn(false);
                }
            )
        );

        // when: creating a new controversial article as that user
        $response = $this
            ->actingAs($user)
            ->postJson(
                '/api/articles',
                [
                    'title' => 'the detector is mocked to always return false',
                    'content' => 'this has no mentions of banned topics',
                ]
            );

        // then: assert that the creation was rejected and no article was stored
        $response->assertJsonValidationErrorFor('content');
        $this->assertDatabaseEmpty('articles');
    }
}
