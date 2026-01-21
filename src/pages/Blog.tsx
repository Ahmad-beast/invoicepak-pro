import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { blogPosts } from "@/data/blogPosts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const Blog = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <SEO
        title="Blog - Tips for Pakistani Freelancers"
        description="Expert guides on invoicing, payments, and taxes for Pakistani freelancers. Learn how to get paid faster and manage your freelance business."
        keywords="pakistani freelancer blog, freelance payments pakistan, invoice tips, freelancer tax guide pakistan"
        canonical="/blog"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 md:py-24 border-b">
            <div className="container max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                The InvoicePak Blog
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Expert guides on payments, invoicing, and taxes for Pakistani freelancers working with international clients.
              </p>
            </div>
          </section>

          {/* Blog Grid */}
          <section className="py-12 md:py-16">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden border hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author}
                        </span>
                      </div>
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">
                        {post.summary}
                      </CardDescription>
                      <Button variant="ghost" className="group/btn p-0 h-auto" asChild>
                        <Link to={`/blog/${post.slug}`}>
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-muted/50 border-t">
            <div className="container max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Create Professional Invoices?
              </h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of Pakistani freelancers using InvoicePak to get paid faster.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
