import { Component } from '@angular/core';
import { NgClass } from '@angular/common';  // Import NgClass
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  standalone: true,  // Make it a standalone component
  imports: [NgClass, CommonModule],  // Add NgClass to imports
})
export class FaqComponent {
  faqs = [
    {
      question: 'What is a birth chart, and how is it calculated?',
      answer: 'A birth chart, or natal chart, is a snapshot of the sky at the exact moment of your birth. It maps the positions of the Sun, Moon, planets, and other celestial points in relation to the Earth. The chart is calculated using your birth date, time, and place, which determines where each celestial body was located in the zodiac at the time of your birth. Astrologers use this information to interpret personality traits, life paths, and potential future trends.',
      open: false
    },
    {
      question: 'What is a natal chart reading?',
      answer: 'A natal chart reading is an interpretation of your birth chart by an astrologer. The reading reveals insights into your personality, emotional patterns, strengths, challenges, and life’s purpose based on the positions of planets in specific signs and houses. The astrologer helps you understand how planetary energies shape various aspects of your life, such as relationships, career, health, and spirituality.',
      open: false
    },
    {
      question: 'How can a natal chart reading with Victoria help me gain deeper self-awareness?',
      answer: 'Victoria’s natal chart readings are designed to offer profound insights into your inner world. By examining your planetary placements and aspects, she can help you uncover hidden patterns, strengths, and challenges in your life. This awareness can guide you in making conscious choices, overcoming personal obstacles, and deepening your understanding of your purpose. The consultation provides you with practical tools for self-growth and clarity about your current life circumstances.',
      open: false
    },
    {
      question: 'What information do I need to provide for a chart calculation?',
      answer: 'To calculate your natal chart, you’ll need to provide your full birth date, the time you were born (preferably to the minute), and the location of your birth (city or town). If you don’t know your exact birth time, the chart can still be generated with less precision, but certain aspects of the reading, like house placements and specific timing, may not be as accurate.',
      open: false
    }
  ];
  

  toggleAnswer(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}
