using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SearchWordDLL
{
    public class TrainPool
    {
        List<Train> train { get; set; } = new List<Train>();
        public Train mainTrain { get; set; } = new Train();
        public char[] exChar { get; set; }
                = @"`-=\][';,.//><:""{}|+_)(*&^%$#@!~".ToCharArray();
        public TrainPool() {
            train.Add(mainTrain);
        }
        public void InCharHelp(char ch) {
            if (ch >= '0' && ch <= '9')
            {
                ClearPool();
                return;
            } else if (ch >= 'a' && ch <= 'z')
            {
                ClearPool();
                return;
            } else if (ch >= 'A' && ch <= 'Z')
            {
                ClearPool();
                return;
            } else if (exChar.Contains(ch))
            {
                ClearPool();
                return;
            } else
            {
                InChar(ch);
                return;
            }
        }
        private void InChar(char ch)
        {
            #region iterator all the train
            for (int i = 0;i < train.Count;i++)
            {
                #region find out the next node
                bool isGet = false;
                int j;
                for (j = 0;j < train[i].child.Count;j++)
                {
                    if (train[i].child[j].nodeData.ch == ch)
                    {
                        train[i].child[j].nodeData.count++;
                        isGet = true;
                        break;
                    }
                }
                #endregion
                #region make next node of the chain into the train pool
                if (isGet)
                {
                    train[i] = train[i].child[j];
                } else
                {
                    Train t = new Train(ch);
                    train[i].child.Add(t);
                    train[i] = t;
                }
                #endregion
            }
            #endregion
            train.Add(mainTrain);
        }
        /// <summary>
        /// Clear Pool and make the mainTrain into the Pool
        /// </summary>
        public void ClearPool()
        {
            train.Clear();
            train.Add(mainTrain);
        }
    }
    public class Train
    {
        public NodeData nodeData { get; set; }
        public List<Train> child { get; set; } = new List<Train>();
        public Train(char ch = '_')
        {
            nodeData = new NodeData();
            nodeData.ch = ch;
        }
    }
    public class NodeData {
        public char ch { get; set; } = '\0';
        public int count { get; set; } = 0;
    }
}
