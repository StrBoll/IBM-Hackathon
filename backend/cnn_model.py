import torch.nn as nn

class CNNModel(nn.Module):
    def __init__(self):
        super(CNNModel, self).__init__()
        self.fc1 = nn.Linear(6, 64)
        self.fc2 = nn.Linear(64, 128)
        self.fc3 = nn.Linear(128, 64)
        self.fc4 = nn.Linear(64, 8)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.2)
        self.batch_norm1 = nn.BatchNorm1d(64)
        self.batch_norm2 = nn.BatchNorm1d(128)
        self.batch_norm3 = nn.BatchNorm1d(64)
    
    def forward(self, x):
        x = self.dropout(self.relu(self.batch_norm1(self.fc1(x))))
        x = self.dropout(self.relu(self.batch_norm2(self.fc2(x))))
        x = self.dropout(self.relu(self.batch_norm3(self.fc3(x))))
        x = self.fc4(x)
        return x

