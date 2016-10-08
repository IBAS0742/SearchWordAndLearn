using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WebMain
{
    public partial class Form1 : Form
    {
        StreamWriter sw;
        public Form1()
        {
            InitializeComponent();
        }

        private void Btn_Start_Click(object sender, EventArgs e)
        {
            webBrowser1.Url = new Uri("http://www.baidu.com");
        }

        private void Btn_Get_Click(object sender, EventArgs e)
        {
            HtmlElement ele = webBrowser1.Document.GetElementsByTagName("html")[0];
            Text_statue.Text = ele.InnerText;
            sw = new StreamWriter("o.txt");
            RSearch(ele);
            sw.Close();
        }
        public void RSearch(HtmlElement ele)
        {
            if (ele.Children.Count == 0) {
                sw.WriteLine(ele.TagName + "\t" + ele.InnerText);
                return;
            } else
            {
                sw.WriteLine(ele.TagName);
                foreach (HtmlElement ele_ in ele.Children)
                {
                    RSearch(ele_);
                }
            }
        }
    }
}
