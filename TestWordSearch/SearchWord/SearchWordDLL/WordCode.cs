using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SearchWordDLL
{
    public class WordCode
    {
        public List<WordCode> wordCode { get; set; } = null;
        public int Count { get; set; } = 0;
        public char ch { get; set; } = '\0';
        public int Length { get; set; } = 20;
        public WordCode()
        {
            wordCode = new List<WordCode>();
        }
        public void AddWord(string str)
        {
            #region str length is zero statutation
            if (str.Length == 0)
            {
                //TO DO
            }
            #endregion
            #region Another Statutation
            else
            {
                WordCode wc = null;
                for (int i = 0;i < wordCode.Count;i++)
                {
                    if (wordCode[i].ch == str[0])
                    {
                        wc = wordCode[i];
                        break;
                    }
                }
                if (wc == null)
                {
                    wc = new WordCode()
                    {
                        ch = str[0]
                    };
                    wordCode.Add(wc);
                }
                wc.Count++;
                wc.AddWord(str.Substring(1));
            }

            #endregion
        }
        public override string ToString() {
            return "";
        }
    }
}
