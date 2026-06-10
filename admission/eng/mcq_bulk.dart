use latex for equation, we will later add the image, you just have to strictly copy everything from there . 
you have to copy word by word , if there is any key question unavailable, dont use that key . you dont have to give context or anything we will later add the image url differently.

after the conversion give me the stats , how many question were there and how many you converted to our format. 

q_s means question serial , let there is 9 question and it is 2 number question , then the q_s is 2/9.keep option_e blank if there is no option e .
if the question is from iut, put the english part too as there. 

you must not have to give any context about the image, word by word copy everytext,

skip written question, only mcq will be given in this json. 

give me the json

demo structure:
{
  "curriculum": [
    {
      "topic": "ভেক্টর যোগ ও বিয়োগ",
      "mcqs": [
        {
          "question_text": "দুইটি সমান মানের ভেক্টরের লব্ধি তাদের যেকোনো একটির মানের সমান হলে তাদের মধ্যবর্তী কোণ কত?",
          "option_a": "60°",
          "option_b": "90°",
          "option_c": "120°",
          "option_d": "180°",
          "correct_option": "c",
  "q_s": "1/2",
          "explanation": "লব্ধি $R = \sqrt{P^2 + Q^2 + 2PQ \cos \theta}$। এখানে $R=P=Q$ বসালে $\cos \theta = -1/2$ পাওয়া যায়, অর্থাৎ $\theta = 120°$।",
          "source": "BUET'22-23; CUET'03-04"
 
        },
        {
          "question_text": "একটি বিশেষ ইঞ্জিনিয়ারিং প্রশ্ন যেখানে ৫টি অপশন প্রয়োজন:",
          "option_a": "10 N",
          "option_b": "20 N",
          "option_c": "30 N",
          "option_d": "40 N",
          "option_e": "50 N",
          "correct_option": "e",
  "q_s": "2/2",
          "explanation": "যেহেতু option_e তে ভ্যালু আছে, অ্যাপটি অটোমেটিক ৫টি বাটন দেখাবে।",
          "source": "CKRUET 22-23"
        }
      ]
    },
    {
      "topic": "ভেক্টর ডট ও ক্রস গুণন",
      "mcqs": [
        {
          "question_text": "$\vec{A} \cdot \vec{B} = 0$ হলে ভেক্টরদ্বয়ের মধ্যবর্তী কোণ কত?",
          "option_a": "0°",
          "option_b": "90°",
          "option_c": "180°",
          "option_d": "45°",
          "correct_option": "b",
  "q_s": "1/1",
          "explanation": "ডট গুণফল শূন্য হওয়া মানে ভেক্টরদ্বয় পরস্পর লম্ব।",
          "source": "KUET 15-16"
        }
      ]
    }
  ]
}
