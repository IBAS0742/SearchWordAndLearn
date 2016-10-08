using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SearchWordDLL;
using Newtonsoft.Json;
using System.IO;

namespace SearchWord
{
    class Program
    {
        static string BaseString = "ABCD";//" EFG";
        static Random r = new Random();
        static void Main(string[] args)
        {
            string str = @"最后我们可以从可用性的角度上看，HTML5可以更好的促进用户于网站间的互动情况。
                        多媒体网站可以获得更多的改进，特别是在移动平台上的应用，使用 HTML5可以提供更多高质量的视频和音频流。
                        到目前为止，事实就是iPhone和iPad将不会支持FLASH，同时ADOBE公司也公开声明将 停止FLASH基于移动平台的开发，
                        可以这么说——移动平台日后视频音频是HTML5的天下！";
            //WordCode wc = new WordCode();
            //wc.AddWord(str.Substring(0,2));
            //Console.WriteLine(wc);
            //using (StreamWriter sw = new StreamWriter("o.json"))
            //{
            //    sw.WriteLine(JsonConvert.SerializeObject(wc));
            //}
            ////Console.WriteLine(GetRandomStr());
            #region
            //DateTime dt = DateTime.Now;
            //DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1, 0, 0, 0, 0));
            //Console.WriteLine((dt.Ticks - startTime.Ticks) / 10000);
            #endregion
            #region TrainPool
            //TrainPool tp = new TrainPool();
            //string subStr = "你们abc你@们";
            //for (int i = 0; i < subStr.Length; i++)
            //{
            //    tp.InCharHelp(subStr[i]);
            //}
            //string JsonResult = JsonConvert.SerializeObject(tp.mainTrain);
            //using (StreamWriter sw = new StreamWriter("o.json", false))
            //{
            //    sw.WriteLine(JsonResult);
            //}
            #endregion
            #region @"""" is what
            //string str_1 = @"abcd""";
            //Console.WriteLine(str_1);
            #endregion
            #region Using Text File
            TrainPool tp = new TrainPool();
            using (StreamReader sr = new StreamReader("test.txt"))
            {
                while (!sr.EndOfStream)
                    tp.InCharHelp((char)sr.Read());
            }
            using (StreamWriter sw = new StreamWriter("o.json"))
            {
                sw.WriteLine(JsonConvert.SerializeObject(tp));
            }
            #endregion
        }
        static string GetRandomStr(int len = 20)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0;i < len;i++) {
                sb.Append(BaseString[r.Next(BaseString.Length)]);
            }
            return sb.ToString();
        }
    }
}
