
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Mail, Github, Twitter, Linkedin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleContactSubmit = async () => {
    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: contactForm
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setContactForm({ name: '', email: '', message: '' });
      setIsContactOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      console.error('Error sending contact form:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>© 2025 Best Nwachinemere</span>
            <Heart className="w-4 h-4 text-accent" />
            <span>Made with lots of love</span>
          </div>

          {/* Contact & Social Links */}
          <div className="flex items-center space-x-4">
            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Get in Touch</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="rounded-lg"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="rounded-lg"
                  />
                  <Textarea
                    placeholder="Your message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="rounded-lg"
                    rows={4}
                  />
                  <Button 
                    onClick={handleContactSubmit}
                    className="w-full bg-primary hover:bg-primary/90 rounded-lg"
                    disabled={!contactForm.name || !contactForm.email || !contactForm.message || isSending}
                  >
                    {isSending ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Social Links */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="rounded-lg">
                <a href="https://github.com/Best-Nwachinemere" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild className="rounded-lg">
                <a href="https://x.com/besti_eth" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild className="rounded-lg">
                <a href="https://www.linkedin.com/in/bestnwachinemere/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
